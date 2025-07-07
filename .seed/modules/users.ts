import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import type { SeedModule, UserSeedData, SeedLogger } from "../types";
import { getRequiredEnvVar } from "../utils";

/**
 * Default users data for seeding
 */
const defaultUsersData: UserSeedData[] = [
  {
    name: "Super Admin",
    email: "superadmin@example.com",
    nip: "", // Will be set from environment
    password: "", // Will be set from environment
    role: "SUPER_ADMIN",
    isActive: true,
    mustChangePassword: true,
  },
];

/**
 * User seed module responsible for creating system users
 */
export class UserSeedModule implements SeedModule {
  name = "Users";

  constructor(
    private logger: SeedLogger,
    private usersData: UserSeedData[] = defaultUsersData
  ) { }

  async run(prisma: PrismaClient): Promise<void> {
    this.logger.info(`Starting ${this.name} seeding...`);

    let created = 0;
    let skipped = 0;

    for (const userData of this.usersData) {
      try {
        // Set environment variables for super admin
        if (userData.role === "SUPER_ADMIN") {
          userData.nip = getRequiredEnvVar("SUPER_ADMIN_NIP");
          userData.password = getRequiredEnvVar("SUPER_ADMIN_PASSWORD");
        }

        const result = await this.createUser(prisma, userData);
        if (result.created) {
          created++;
          this.logger.success(`Created user: ${userData.name} (${userData.nip})`);
        } else {
          skipped++;
          this.logger.info(`User ${userData.nip} already exists, skipping`);
        }
      } catch (error) {
        this.logger.error(`Failed to create user ${userData.name}: ${error}`);
        throw error;
      }
    }

    this.logger.success(
      `${this.name} seeding completed. Created: ${created}, Skipped: ${skipped}`
    );
  }

  private async createUser(
    prisma: PrismaClient,
    userData: UserSeedData
  ): Promise<{ created: boolean; user?: any }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { nip: userData.nip },
    });

    if (existingUser) {
      return { created: false, user: existingUser };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Find organization if specified
    let organizationId: string | undefined;
    if (userData.organizationSigla) {
      const organization = await prisma.organization.findUnique({
        where: { sigla: userData.organizationSigla },
      });

      if (!organization) {
        throw new Error(
          `Organization with sigla ${userData.organizationSigla} not found`
        );
      }
      organizationId = organization.id;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        nip: userData.nip,
        password: hashedPassword,
        role: userData.role,
        isActive: userData.isActive ?? true,
        mustChangePassword: userData.mustChangePassword ?? true,
        organizationId,
      },
    });

    return { created: true, user };
  }

  /**
   * Add a user to the seeding data
   */
  addUser(userData: UserSeedData): void {
    this.usersData.push(userData);
  }

  /**
   * Clear all users data
   */
  clearUsers(): void {
    this.usersData.length = 0;
  }

  /**
   * Set users data
   */
  setUsers(usersData: UserSeedData[]): void {
    this.usersData = usersData;
  }
}
