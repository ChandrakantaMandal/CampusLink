import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaPgMock = vi.hoisted(() => ({
  PrismaPg: vi.fn().mockImplementation(function (
    this: unknown,
    config: unknown,
  ) {
    Object.assign(this as object, {
      __type: "PrismaPg",
      config,
    });
  }),
}));

const prismaClientMock = vi.hoisted(() => ({
  PrismaClient: vi.fn().mockImplementation(function (
    this: unknown,
    config: unknown,
  ) {
    Object.assign(this as object, {
      __type: "PrismaClient",
      config,
    });
  }),
}));

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: prismaPgMock.PrismaPg,
}));

vi.mock("../prisma/generated/client", () => ({
  PrismaClient: prismaClientMock.PrismaClient,
}));

import { createPrismaClient } from "../src/index";

describe("createPrismaClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a Prisma PostgreSQL adapter with DATABASE_URL", () => {
    const env = {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test_database",
    };

    createPrismaClient(env);

    expect(prismaPgMock.PrismaPg).toHaveBeenCalledTimes(1);

    expect(prismaPgMock.PrismaPg).toHaveBeenCalledWith({
      connectionString: env.DATABASE_URL,
    });
  });

  it("should create a PrismaClient using the PostgreSQL adapter", () => {
    const env = {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test_database",
    };

    const result = createPrismaClient(env);

    expect(prismaClientMock.PrismaClient).toHaveBeenCalledTimes(1);

    expect(prismaClientMock.PrismaClient).toHaveBeenCalledWith({
      adapter: expect.objectContaining({
        __type: "PrismaPg",
      }),
    });

    expect(result).toBeInstanceOf(prismaClientMock.PrismaClient);
  });

  it("should return the PrismaClient instance", () => {
    const env = {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test_database",
    };

    const result = createPrismaClient(env);

    expect(result).toBeInstanceOf(prismaClientMock.PrismaClient);
  });

  it("should use the exact DATABASE_URL provided by the environment", () => {
    const databaseUrl =
      "postgresql://example-user:example-password@db.example.com:5432/CampusLink";

    const env = {
      DATABASE_URL: databaseUrl,
    };

    createPrismaClient(env);

    expect(prismaPgMock.PrismaPg).toHaveBeenCalledWith({
      connectionString: databaseUrl,
    });
  });
});
