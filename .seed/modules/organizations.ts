import type { PrismaClient } from "@prisma/client";
import type { SeedModule, OrganizationSeedData, SeedLogger } from "../types";

/**
 * Default organizations data for seeding
 */
const defaultOrganizationsData: OrganizationSeedData[] = [
  // Parent organizations (COMIMSUP)
  {
    name: "Centro de Suprimentos do Abastecimento",
    sigla: "CSupAb",
    description: "VRF",
    role: "COMIMSUP",
  },
  {
    name: "Centro de Operações do Abastecimento",
    sigla: "COpAb",
    description: "VRF",
    role: "COMIMSUP",
  },
  // COMRJ organization
  {
    name: "Centro de Obtenção da Marinha no Rio de Janeiro",
    sigla: "COMRJ",
    description:
      "Realiza a aquisição de materiais e serviços no mercado nacional, conforme atribuições designadas, apoiando as unidades navais e administrativas.",
    role: "COMRJ",
  },
  // Child organizations (DEPOSITO) under CSupAb
  {
    name: "Depósito de Fardamento da Marinha no Rio de Janeiro",
    sigla: "DepFMRJ",
    description:
      "Responsável pelo recebimento, armazenamento, e distribuição de uniformes e fardamentos aos militares da Marinha do Brasil.",
    role: "DEPOSITO",
    parentSigla: "CSupAb",
  },
  {
    name: "Depósito de Suprimento de Intendência da Marinha no Rio de Janeiro",
    sigla: "DepSIMRJ",
    description:
      "Responsável pelo recebimento, armazenamento, e distribuição de gêneros alimentícios e materiais comuns, garantindo o apoio logístico às OMs da Marinha do Brasil.",
    role: "DEPOSITO",
    parentSigla: "CSupAb",
  },
  {
    name: "Depósito de Material de Saúde da Marinha no Rio de Janeiro",
    sigla: "DepMSMRJ",
    description:
      "Responsável pelo recebimento, armazenamento, e distribuição de insumos, medicamentos e materiais médico-hospitalares às OMs da Marinha do Brasil",
    role: "DEPOSITO",
    parentSigla: "CSupAb",
  },
  // Child organizations (DEPOSITO) under COpAb
  {
    name: "Depósito de Sobressalentes da Marinha no Rio de Janeiro",
    sigla: "DepSMRJ",
    description:
      "Responsável pelo recebimento, armazenamento, e distribuição de peças de reposição e sobressalentes às OMs da Marinha do Brasil",
    role: "DEPOSITO",
    parentSigla: "COpAb",
  },
  {
    name: "Centro de Munição da Marinha",
    sigla: "CMM",
    description:
      "Responsável pelo recebimento, armazenamento, e distribuição de munições e explosivos utilizados pelas OMs.",
    role: "DEPOSITO",
    parentSigla: "COpAb",
  },
  {
    name: "Depósito de Combustíveis da Marinha no Rio de Janeiro",
    sigla: "DepCMRJ",
    description:
      "Responsável pelo recebimento, estocagem, controle de qualidade e distribuição de combustíveis e lubrificantes para as OM da MB.",
    role: "DEPOSITO",
    parentSigla: "COpAb",
  },
];

/**
 * Organization seed module responsible for creating organizations and their hierarchical relationships
 */
export class OrganizationSeedModule implements SeedModule {
  name = "Organizations";

  constructor(
    private logger: SeedLogger,
    private organizationsData: OrganizationSeedData[] = defaultOrganizationsData,
  ) {}

  async run(prisma: PrismaClient): Promise<void> {
    this.logger.info(`Starting ${this.name} seeding...`);

    // Create parent organizations first
    const { created: parentCreated, skipped: parentSkipped } =
      await this.createParentOrganizations(prisma);

    // Create child organizations
    const { created: childCreated, skipped: childSkipped } =
      await this.createChildOrganizations(prisma);

    const totalCreated = parentCreated + childCreated;
    const totalSkipped = parentSkipped + childSkipped;

    this.logger.success(
      `${this.name} seeding completed. Created: ${totalCreated}, Skipped: ${totalSkipped}`,
    );
  }

  private async createParentOrganizations(
    prisma: PrismaClient,
  ): Promise<{ created: number; skipped: number }> {
    this.logger.info("Creating parent organizations...");

    const parentOrgs = this.organizationsData.filter((org) => !org.parentSigla);
    const organizationIdMap = new Map<string, string>();
    let created = 0;
    let skipped = 0;

    for (const orgData of parentOrgs) {
      try {
        const result = await this.createOrganization(prisma, orgData);

        if (result.created) {
          created++;
          organizationIdMap.set(orgData.sigla, result.organization.id);
          this.logger.success(`Created parent organization: ${orgData.sigla}`);
        } else {
          skipped++;
          organizationIdMap.set(orgData.sigla, result.organization.id);
          this.logger.info(
            `Organization ${orgData.sigla} already exists, skipping`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to create organization ${orgData.sigla}: ${error}`,
        );
        throw error;
      }
    }

    // Store the ID map for child organization creation
    this.organizationIdMap = organizationIdMap;

    return { created, skipped };
  }

  private async createChildOrganizations(
    prisma: PrismaClient,
  ): Promise<{ created: number; skipped: number }> {
    this.logger.info("Creating child organizations...");

    const childOrgs = this.organizationsData.filter((org) => org.parentSigla);
    let created = 0;
    let skipped = 0;

    for (const orgData of childOrgs) {
      try {
        // Get parent organization ID
        const parentId = await this.getParentOrganizationId(
          prisma,
          orgData.parentSigla || "",
        );

        const result = await this.createOrganization(prisma, orgData, parentId);

        if (result.created) {
          created++;
          this.logger.success(
            `Created child organization: ${orgData.sigla} under ${orgData.parentSigla}`,
          );
        } else {
          skipped++;
          this.logger.info(
            `Organization ${orgData.sigla} already exists, skipping`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to create organization ${orgData.sigla}: ${error}`,
        );
        throw error;
      }
    }

    return { created, skipped };
  }

  private async createOrganization(
    prisma: PrismaClient,
    orgData: OrganizationSeedData,
    parentId?: string,
  ): Promise<{ created: boolean; organization: any }> {
    // Check if organization already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { sigla: orgData.sigla },
    });

    if (existingOrg) {
      return { created: false, organization: existingOrg };
    }

    // Create organization with all default elements in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the organization
      const organization = await tx.organization.create({
        data: {
          name: orgData.name,
          sigla: orgData.sigla,
          description: orgData.description,
          role: orgData.role,
          isActive: true,
          lunchTimeStart: 12 * 60, // 12:00 PM
          lunchTimeEnd: 13 * 60, // 1:00 PM
          comimsupId: parentId || null,
        },
      });

      // 2. Create a default schedule
      const defaultSchedule = await tx.schedule.create({
        data: {
          name: "Horário Padrão",
          organizationId: organization.id,
          isDefault: true,
          availability: {
            createMany: {
              data: [
                // Monday to Friday, 9 AM to 3 PM
                {
                  weekDay: 1,
                  startTime: 9 * 60,
                  endTime: 15 * 60,
                },
                {
                  weekDay: 2,
                  startTime: 9 * 60,
                  endTime: 15 * 60,
                },
                {
                  weekDay: 3,
                  startTime: 9 * 60,
                  endTime: 15 * 60,
                },
                {
                  weekDay: 4,
                  startTime: 9 * 60,
                  endTime: 15 * 60,
                },
                {
                  weekDay: 5,
                  startTime: 9 * 60,
                  endTime: 15 * 60,
                },
              ],
            },
          },
        },
      });

      // 3. Create two default delivery types linked to the default schedule
      await tx.deliveryType.createMany({
        data: [
          {
            name: "Entrega Normal",
            slug: `entrega-normal-${organization.sigla}`,
            isVisible: true,
            organizationId: organization.id,
            scheduleId: defaultSchedule.id,
            duration: 90,
          },
          {
            name: "Entrega Secreta",
            slug: `entrega-secreta-${organization.sigla}`,
            isVisible: false,
            organizationId: organization.id,
            scheduleId: defaultSchedule.id,
            duration: 60,
          },
        ],
      });

      this.logger.info(
        `Created default schedule and delivery types for ${orgData.sigla}`,
      );

      return organization;
    });

    return { created: true, organization: result };
  }

  private async getParentOrganizationId(
    prisma: PrismaClient,
    parentSigla: string,
  ): Promise<string> {
    // First check in our ID map
    if (this.organizationIdMap?.has(parentSigla)) {
      const id = this.organizationIdMap.get(parentSigla);
      if (id) return id;
    }

    // Fallback to database query
    const parentOrg = await prisma.organization.findUnique({
      where: { sigla: parentSigla },
    });

    if (!parentOrg) {
      throw new Error(`Parent organization ${parentSigla} not found`);
    }

    return parentOrg.id;
  }

  /**
   * Add an organization to the seeding data
   */
  addOrganization(orgData: OrganizationSeedData): void {
    this.organizationsData.push(orgData);
  }

  /**
   * Clear all organizations data
   */
  clearOrganizations(): void {
    this.organizationsData.length = 0;
  }

  /**
   * Set organizations data
   */
  setOrganizations(organizationsData: OrganizationSeedData[]): void {
    this.organizationsData = organizationsData;
  }

  // Private property to store organization ID mapping
  private organizationIdMap?: Map<string, string>;
}
