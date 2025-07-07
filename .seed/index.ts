import type { PrismaClient } from "@prisma/client";
import type { SeedModule, SeedConfig } from "./types";
import { ClackSeedLogger } from "./utils";
import { UserSeedModule } from "./modules/users";
import { OrganizationSeedModule } from "./modules/organizations";

/**
 * Main seed orchestrator that manages all seed modules
 */
export class SeedOrchestrator {
  private modules: SeedModule[] = [];
  private logger: ClackSeedLogger;

  constructor(private config: SeedConfig = {}) {
    this.logger = new ClackSeedLogger();
    this.initializeDefaultModules();
  }

  /**
   * Initialize default seed modules in the correct order
   */
  private initializeDefaultModules(): void {
    // Order matters: Organizations must be created before users that reference them
    this.modules = [
      new OrganizationSeedModule(this.logger),
      new UserSeedModule(this.logger),
    ];
  }

  /**
   * Add a custom seed module
   */
  addModule(module: SeedModule): void {
    this.modules.push(module);
  }

  /**
   * Remove a seed module by name
   */
  removeModule(name: string): boolean {
    const index = this.modules.findIndex(module => module.name === name);
    if (index !== -1) {
      this.modules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clear all modules
   */
  clearModules(): void {
    this.modules = [];
  }

  /**
   * Get all registered modules
   */
  getModules(): SeedModule[] {
    return [...this.modules];
  }

  /**
   * Run all seed modules
   */
  async runAll(prisma: PrismaClient): Promise<void> {
    this.logger.info("🌱 Starting database seeding...");

    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    for (const module of this.modules) {
      try {
        this.logger.info(`\n📦 Running ${module.name} module...`);
        await module.run(prisma);
        successCount++;
      } catch (error) {
        errorCount++;
        this.logger.error(`Failed to run ${module.name} module: ${error}`);

        // Stop execution on first error unless configured otherwise
        if (!this.config.skipExisting) {
          throw error;
        }
      }
    }

    const duration = Date.now() - startTime;

    this.logger.info(`\n🎉 Seeding completed in ${duration}ms`);
    this.logger.success(`✅ Success: ${successCount} modules`);

    if (errorCount > 0) {
      this.logger.error(`❌ Errors: ${errorCount} modules`);
    }
  }

  /**
   * Run a specific seed module by name
   */
  async runModule(name: string, prisma: PrismaClient): Promise<void> {
    const module = this.modules.find(m => m.name === name);

    if (!module) {
      throw new Error(`Seed module '${name}' not found`);
    }

    this.logger.info(`🌱 Running ${name} module...`);
    await module.run(prisma);
    this.logger.success(`✅ ${name} module completed`);
  }

  /**
   * Run multiple specific modules by name
   */
  async runModules(names: string[], prisma: PrismaClient): Promise<void> {
    this.logger.info(`🌱 Running ${names.length} specific modules...`);

    for (const name of names) {
      await this.runModule(name, prisma);
    }

    this.logger.success(`✅ All ${names.length} modules completed`);
  }
}

/**
 * Create a new seed orchestrator with default configuration
 */
export function createSeedOrchestrator(config?: SeedConfig): SeedOrchestrator {
  return new SeedOrchestrator(config);
}

/**
 * Quick helper to run all default seeds
 */
export async function runAllSeeds(prisma: PrismaClient, config?: SeedConfig): Promise<void> {
  const orchestrator = createSeedOrchestrator(config);
  await orchestrator.runAll(prisma);
}

/**
 * Quick helper to run specific seeds
 */
export async function runSeeds(
  names: string[],
  prisma: PrismaClient,
  config?: SeedConfig
): Promise<void> {
  const orchestrator = createSeedOrchestrator(config);
  await orchestrator.runModules(names, prisma);
}
