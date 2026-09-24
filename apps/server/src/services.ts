import { createAuth } from "@CampusLink/auth";
import { createPrismaClient } from "@CampusLink/db";
import { redis } from "@CampusLink/redis";

import { ENV } from "./env.server";

export const db = createPrismaClient(ENV);
export const auth = createAuth(ENV, db);
export { redis };
