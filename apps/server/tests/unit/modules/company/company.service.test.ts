import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    company: {
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    recruiterProfile: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock("../../../../src/services.ts", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../../../../src/modules/companies/company.service";

describe("Company Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);

    mocks.db.company.findFirst.mockResolvedValue(null);
    mocks.db.company.findMany.mockResolvedValue([]);
    mocks.db.company.findUnique.mockResolvedValue(null);
    mocks.db.company.create.mockResolvedValue({
      id: "company-1",
      name: "Google",
    });
    mocks.db.company.update.mockResolvedValue({
      id: "company-1",
      name: "Google",
    });

    mocks.db.recruiterProfile.findUnique.mockResolvedValue({
      userId: "user-1",
      companyId: "company-1",
    });

    mocks.db.recruiterProfile.update.mockResolvedValue({
      userId: "user-1",
      companyId: "company-1",
    });
  });

  describe("createCompany", () => {
    const companyData = {
      name: "Google",
      description: "Technology company",
      website: "https://www.google.com",
      location: "Bangalore",
      industry: "Technology",
      logoUrl: "https://example.com/google.png",
    };

    it("should create a company successfully", async () => {
      const company = {
        id: "company-1",
        ...companyData,
      };

      mocks.db.company.create.mockResolvedValue(company);

      const result = await createCompany(companyData, "user-1");

      expect(result).toEqual(company);

      expect(mocks.db.company.findFirst).toHaveBeenCalledWith({
        where: {
          name: "Google",
        },
      });

      expect(mocks.db.company.create).toHaveBeenCalledWith({
        data: {
          name: "Google",
          description: "Technology company",
          website: "https://www.google.com",
          location: "Bangalore",
          industry: "Technology",
          logoUrl: "https://example.com/google.png",
        },
      });
    });

    it("should reject duplicate company names", async () => {
      mocks.db.company.findFirst.mockResolvedValue({
        id: "existing-company",
        name: "Google",
      });

      await expect(createCompany(companyData, "user-1")).rejects.toThrow(
        "A company with this name already exists",
      );

      expect(mocks.db.company.create).not.toHaveBeenCalled();
      expect(mocks.db.recruiterProfile.update).not.toHaveBeenCalled();
    });

    it("should update recruiter profile with the new company", async () => {
      const company = {
        id: "company-1",
        ...companyData,
      };

      mocks.db.company.create.mockResolvedValue(company);

      await createCompany(companyData, "user-1");

      expect(mocks.db.recruiterProfile.update).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        data: {
          companyId: "company-1",
        },
      });
    });

    it("should invalidate company-related caches after creation", async () => {
      const company = {
        id: "company-1",
        ...companyData,
      };

      mocks.db.company.create.mockResolvedValue(company);

      await createCompany(companyData, "user-1");

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "companies:all",
        "admin:companies",
        "admin:recruiters",
        "admin:dashboard:stats",
      );
    });

    it("should use the provided user id when updating recruiter profile", async () => {
      await createCompany(companyData, "recruiter-123");

      expect(mocks.db.recruiterProfile.update).toHaveBeenCalledWith({
        where: {
          userId: "recruiter-123",
        },
        data: {
          companyId: "company-1",
        },
      });
    });
  });

  describe("getCompanies", () => {
    it("should return cached companies", async () => {
      const companies = [
        {
          id: "company-1",
          name: "Google",
        },
        {
          id: "company-2",
          name: "Microsoft",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(companies));

      const result = await getCompanies();

      expect(result).toEqual(companies);
      expect(mocks.redis.get).toHaveBeenCalledWith("companies:all");
      expect(mocks.db.company.findMany).not.toHaveBeenCalled();
    });

    it("should fetch companies from database when cache is empty", async () => {
      const companies = [
        {
          id: "company-1",
          name: "Google",
        },
        {
          id: "company-2",
          name: "Microsoft",
        },
      ];

      mocks.redis.get.mockResolvedValue(null);
      mocks.db.company.findMany.mockResolvedValue(companies);

      const result = await getCompanies();

      expect(result).toEqual(companies);

      expect(mocks.db.company.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: "asc",
        },
      });
    });

    it("should cache companies after fetching from database", async () => {
      const companies = [
        {
          id: "company-1",
          name: "Google",
        },
      ];

      mocks.db.company.findMany.mockResolvedValue(companies);

      await getCompanies();

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "companies:all",
        JSON.stringify(companies),
        "EX",
        300,
      );
    });

    it("should return empty array when no companies exist", async () => {
      mocks.db.company.findMany.mockResolvedValue([]);

      const result = await getCompanies();

      expect(result).toEqual([]);
      expect(mocks.redis.set).toHaveBeenCalledWith(
        "companies:all",
        JSON.stringify([]),
        "EX",
        300,
      );
    });

    it("should remove invalid cached JSON and fetch from database", async () => {
      const companies = [
        {
          id: "company-1",
          name: "Google",
        },
      ];

      mocks.redis.get.mockResolvedValue("invalid-json");
      mocks.db.company.findMany.mockResolvedValue(companies);

      const result = await getCompanies();

      expect(result).toEqual(companies);

      expect(mocks.redis.del).toHaveBeenCalledWith("companies:all");
      expect(mocks.db.company.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: "asc",
        },
      });
    });
  });

  describe("getCompanyById", () => {
    it("should return cached company", async () => {
      const company = {
        id: "company-1",
        name: "Google",
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(company));

      const result = await getCompanyById("company-1");

      expect(result).toEqual(company);
      expect(mocks.redis.get).toHaveBeenCalledWith("company:company-1");
      expect(mocks.db.company.findUnique).not.toHaveBeenCalled();
    });

    it("should fetch company from database when cache is empty", async () => {
      const company = {
        id: "company-1",
        name: "Google",
      };

      mocks.db.company.findUnique.mockResolvedValue(company);

      const result = await getCompanyById("company-1");

      expect(result).toEqual(company);

      expect(mocks.db.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: "company-1",
        },
        include: {
          recruiters: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          jobs: true,
        },
      });
    });

    it("should cache company after fetching it", async () => {
      const company = {
        id: "company-1",
        name: "Google",
      };

      mocks.db.company.findUnique.mockResolvedValue(company);

      await getCompanyById("company-1");

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "company:company-1",
        JSON.stringify(company),
        "EX",
        300,
      );
    });

    it("should return null when company does not exist", async () => {
      mocks.db.company.findUnique.mockResolvedValue(null);

      const result = await getCompanyById("company-1");

      expect(result).toBeNull();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should remove invalid cached JSON and fetch from database", async () => {
      const company = {
        id: "company-1",
        name: "Google",
      };

      mocks.redis.get.mockResolvedValue("invalid-json");
      mocks.db.company.findUnique.mockResolvedValue(company);

      const result = await getCompanyById("company-1");

      expect(result).toEqual(company);
      expect(mocks.redis.del).toHaveBeenCalledWith("company:company-1");
      expect(mocks.db.company.findUnique).toHaveBeenCalled();
    });
  });

  describe("updateCompany", () => {
    const updateData = {
      name: "Google India",
      location: "Bangalore",
      industry: "Technology",
    };

    it("should update company successfully", async () => {
      const updatedCompany = {
        id: "company-1",
        ...updateData,
      };

      mocks.db.company.update.mockResolvedValue(updatedCompany);

      const result = await updateCompany("company-1", "user-1", updateData);

      expect(result).toEqual(updatedCompany);

      expect(mocks.db.company.update).toHaveBeenCalledWith({
        where: {
          id: "company-1",
        },
        data: updateData,
      });
    });

    it("should reject when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(
        updateCompany("company-1", "user-1", updateData),
      ).rejects.toThrow("Recruiter profile not found");

      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });

    it("should reject when recruiter belongs to a different company", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue({
        userId: "user-1",
        companyId: "company-2",
      });

      await expect(
        updateCompany("company-1", "user-1", updateData),
      ).rejects.toThrow("You are not authorized to update this company");

      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });

    it("should find recruiter profile using user id", async () => {
      await updateCompany("company-1", "user-123", updateData);

      expect(mocks.db.recruiterProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
        },
      });
    });

    it("should invalidate company caches after update", async () => {
      await updateCompany("company-1", "user-1", updateData);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "company:company-1",
        "companies:all",
        "admin:companies",
        "admin:recruiters",
      );
    });
  });
});
