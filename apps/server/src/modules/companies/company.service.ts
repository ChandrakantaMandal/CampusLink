import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type { CreateCompanyInput, UpdateCompanyInput } from "./company.schema";

const CACHE_TTL = 300;

async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);

  if (!cached) {
    return null;
  }

  try {
    return JSON.parse(cached) as T;
  } catch {
    await redis.del(key);
    return null;
  }
}

async function setCache(
  key: string,
  data: unknown,
  ttl = CACHE_TTL,
): Promise<void> {
  await redis.set(key, JSON.stringify(data), "EX", ttl);
}

export async function createCompany(data: CreateCompanyInput, userId: string) {
  const existingCompany = await db.company.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingCompany) {
    throw new Error("A company with this name already exists");
  }

  const company = await db.company.create({
    data: {
      name: data.name,
      description: data.description,
      website: data.website,
      location: data.location,
      industry: data.industry,
      logoUrl: data.logoUrl,
    },
  });

  await db.recruiterProfile.update({
    where: {
      userId,
    },
    data: {
      companyId: company.id,
    },
  });

  await redis.del(
    "companies:all",
    "admin:companies",
    "admin:recruiters",
    "admin:dashboard:stats",
  );

  return company;
}

export async function getCompanies() {
  const cacheKey = "companies:all";

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const companies = await db.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  await setCache(cacheKey, companies);

  return companies;
}

export async function getCompanyById(id: string) {
  const cacheKey = `company:${id}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const company = await db.company.findUnique({
    where: {
      id,
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

  if (company) {
    await setCache(cacheKey, company);
  }

  return company;
}

export async function updateCompany(
  companyId: string,
  userId: string,
  data: UpdateCompanyInput,
) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  if (recruiter.companyId !== companyId) {
    throw new Error("You are not authorized to update this company");
  }

  const company = await db.company.update({
    where: {
      id: companyId,
    },
    data,
  });

  await redis.del(
    `company:${companyId}`,
    "companies:all",
    "admin:companies",
    "admin:recruiters",
  );

  return company;
}
