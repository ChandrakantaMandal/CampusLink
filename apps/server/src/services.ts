import { createAuth } from "@HireBridge/auth";
import { createPrismaClient } from "@HireBridge/db";

import { ENV } from "./env.server";

export const db = createPrismaClient(ENV);
export const auth = createAuth(ENV, db);
