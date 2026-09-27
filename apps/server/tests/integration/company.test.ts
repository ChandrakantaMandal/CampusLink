import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

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
  getSession: vi.fn(),
}));

vi.mock("../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: async (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-1",
      email: "recruiter@example.com",
      name: "Test Recruiter",
      role: "RECRUITER",
    };

    req.session = {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 3600000),
    };

    next();
  },
}));

vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole: (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!allowedRoles.includes(req.user?.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      next();
    };
  },
}));

import companyRouter from "../../src/modules/companies/company.routes";

const app = express();

app.use(express.json());
app.use("/api/companies", companyRouter);

app.use((error: Error, _req: any, res: any, _next: any) => {
  return res.status(500).json({
    success: false,
    message: error.message,
  });
});

describe("Company Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);

    mocks.db.company.findFirst.mockResolvedValue(null);

    mocks.db.company.create.mockResolvedValue({
      id: "company-1",
      name: "Google",
      description: "Technology company",
      website: "https://google.com",
      location: "Bangalore",
      industry: "Technology",
      logoUrl: "https://google.com/logo.png",
    });

    mocks.db.company.findMany.mockResolvedValue([]);

    mocks.db.company.findUnique.mockResolvedValue(null);

    mocks.db.company.update.mockResolvedValue({
      id: "company-1",
      name: "Google India",
      description: "Updated description",
      website: "https://google.com",
      location: "Bangalore",
      industry: "Technology",
      logoUrl: "https://google.com/logo.png",
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

  describe("POST /api/companies", () => {
    it("should create a company", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Google",
          description: "Technology company",
          website: "https://google.com",
          location: "Bangalore",
          industry: "Technology",
          logoUrl: "https://google.com/logo.png",
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Company created successfully",
        data: {
          id: "company-1",
          name: "Google",
          description: "Technology company",
          website: "https://google.com",
          location: "Bangalore",
          industry: "Technology",
          logoUrl: "https://google.com/logo.png",
        },
      });

      expect(mocks.db.company.findFirst).toHaveBeenCalledWith({
        where: {
          name: "Google",
        },
      });

      expect(mocks.db.company.create).toHaveBeenCalled();

      expect(mocks.db.recruiterProfile.update).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        data: {
          companyId: "company-1",
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "companies:all",
        "admin:companies",
        "admin:recruiters",
        "admin:dashboard:stats",
      );
    });

    it("should reject invalid company data", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "G",
          website: "invalid-url",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid company data");

      expect(mocks.db.company.create).not.toHaveBeenCalled();
    });

    it("should reject duplicate company names", async () => {
      mocks.db.company.findFirst.mockResolvedValue({
        id: "existing-company",
        name: "Google",
      });

      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Google",
        });

      expect(response.status).toBe(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "A company with this name already exists",
      );

      expect(mocks.db.company.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/companies", () => {
    it("should return all companies", async () => {
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

      mocks.db.company.findMany.mockResolvedValue(companies);

      const response = await request(app).get("/api/companies");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: companies,
      });

      expect(mocks.db.company.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: "asc",
        },
      });

      expect(mocks.redis.set).toHaveBeenCalled();
    });

    it("should return cached companies", async () => {
      const companies = [
        {
          id: "company-1",
          name: "Google",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(companies));

      const response = await request(app).get("/api/companies");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: companies,
      });

      expect(mocks.db.company.findMany).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/companies/:id", () => {
    it("should return a company by ID", async () => {
      const company = {
        id: "company-1",
        name: "Google",
        description: "Technology company",
        website: "https://google.com",
        location: "Bangalore",
        industry: "Technology",
        logoUrl: "https://google.com/logo.png",
        recruiters: [],
        jobs: [],
      };

      mocks.db.company.findUnique.mockResolvedValue(company);

      const response = await request(app).get(
        "/api/companies/company-1",
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: company,
      });

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

    it("should return cached company", async () => {
      const company = {
        id: "company-1",
        name: "Google",
        recruiters: [],
        jobs: [],
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(company));

      const response = await request(app).get(
        "/api/companies/company-1",
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: company,
      });

      expect(mocks.db.company.findUnique).not.toHaveBeenCalled();
    });

    it("should return 404 when company does not exist", async () => {
      mocks.db.company.findUnique.mockResolvedValue(null);

      const response = await request(app).get(
        "/api/companies/company-999",
      );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Company not found",
      });
    });
  });

  describe("PATCH /api/companies/:id", () => {
    it("should update a company", async () => {
      const response = await request(app)
        .patch("/api/companies/company-1")
        .send({
          name: "Google India",
          description: "Updated description",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Company updated successfully",
        data: {
          id: "company-1",
          name: "Google India",
          description: "Updated description",
          website: "https://google.com",
          location: "Bangalore",
          industry: "Technology",
          logoUrl: "https://google.com/logo.png",
        },
      });

      expect(
        mocks.db.recruiterProfile.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.company.update).toHaveBeenCalledWith({
        where: {
          id: "company-1",
        },
        data: {
          name: "Google India",
          description: "Updated description",
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "company:company-1",
        "companies:all",
        "admin:companies",
        "admin:recruiters",
      );
    });

    it("should reject invalid update data", async () => {
      const response = await request(app)
        .patch("/api/companies/company-1")
        .send({
          name: "G",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid company data");

      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid company ID", async () => {
      const response = await request(app)
        .patch("/api/companies/")
        .send({
          name: "Google India",
        });

      expect(response.status).toBe(404);
    });

    it("should return error when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/companies/company-1")
        .send({
          name: "Google India",
        });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe(
        "Recruiter profile not found",
      );

      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });

    it("should reject recruiter updating another company", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue({
        userId: "user-1",
        companyId: "company-2",
      });

      const response = await request(app)
        .patch("/api/companies/company-1")
        .send({
          name: "Google India",
        });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe(
        "You are not authorized to update this company",
      );

      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });
  });

  describe("Authentication and authorization", () => {
    it("should allow recruiter to create a company", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Amazon",
        });

      expect(response.status).toBe(201);
    });

    it("should allow recruiter to update their company", async () => {
      const response = await request(app)
        .patch("/api/companies/company-1")
        .send({
          name: "Amazon India",
        });

      expect(response.status).toBe(200);
    });
  });
});