import type { PrismaClient } from "@prisma/client";

/**
 * Base interface for all seed modules
 */
export interface SeedModule {
  name: string;
  run(prisma: PrismaClient): Promise<void>;
}

/**
 * Configuration for seed execution
 */
export interface SeedConfig {
  skipExisting?: boolean;
  verbose?: boolean;
}

/**
 * Organization data structure for seeding
 */
export interface OrganizationSeedData {
  name: string;
  sigla: string;
  description: string;
  role: "COMIMSUP" | "COMRJ" | "DEPOSITO";
  parentSigla?: string; // Reference to parent organization sigla
}

/**
 * User data structure for seeding
 */
export interface UserSeedData {
  name: string;
  email: string;
  nip: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "COMIMSUP_ADMIN" | "COMRJ_ADMIN" | "USER";
  mustChangePassword?: boolean;
  isActive?: boolean;
  organizationSigla?: string;
}

/**
 * Result of a seed operation
 */
export interface SeedResult {
  module: string;
  success: boolean;
  message: string;
  created: number;
  skipped: number;
}

/**
 * Logger interface for seed operations
 */
export interface SeedLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
  step?(message: string): void;
  message?(message: string, symbol?: string): void;
}
