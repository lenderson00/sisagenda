# Database Seeding System

A modular, type-safe database seeding system for the SisGenda application following SOLID principles and clean code practices.

## 📁 Structure

```
.seed/
├── README.md                    # This documentation
├── index.ts                     # Main orchestrator and quick helpers
├── types.ts                     # Shared types and interfaces
├── utils.ts                     # Utility functions and logger
└── modules/
    ├── index.ts                 # Module exports
    ├── users.ts                 # User seeding module
    └── organizations.ts         # Organization seeding module
```

## 🚀 Quick Start

### Run All Seeds

```bash
npx prisma db seed
```

### Programmatic Usage

```typescript
import { runAllSeeds } from "./.seed";
import { prisma } from "./src/lib/prisma";

// Run all seeds
await runAllSeeds(prisma, { verbose: true });

// Run specific seeds
await runSeeds(["Organizations", "Users"], prisma);
```

## 🏗️ Architecture

### Core Interfaces

**SeedModule**: Base interface for all seed modules

```typescript
interface SeedModule {
  name: string;
  run(prisma: PrismaClient): Promise<void>;
}
```

**SeedConfig**: Configuration options

```typescript
interface SeedConfig {
  skipExisting?: boolean; // Skip modules on error
  verbose?: boolean; // Enable detailed logging
}
```

### Seed Orchestrator

The `SeedOrchestrator` class manages module execution:

```typescript
import { SeedOrchestrator } from "./.seed";

const orchestrator = new SeedOrchestrator({ verbose: true });

// Add custom module
orchestrator.addModule(new CustomSeedModule());

// Run all modules
await orchestrator.runAll(prisma);

// Run specific module
await orchestrator.runModule("Organizations", prisma);
```

## 📦 Available Modules

### 1. Organizations Module

Creates Navy organizations with hierarchical relationships:

- **Parent Organizations (COMIMSUP)**: CSupAb, COpAb
- **COMRJ Organization**: COMRJ
- **Child Organizations (DEPOSITO)**: DepFMRJ, DepSIMRJ, etc.

### 2. Users Module

Creates system users:

- **Super Admin**: From environment variables
- **Organization Users**: Linked to specific organizations

## 🔧 Creating Custom Modules

### 1. Create Module Class

```typescript
import type { SeedModule, SeedLogger } from "../types";
import type { PrismaClient } from "@prisma/client";

export class CustomSeedModule implements SeedModule {
  name = "Custom";

  constructor(private logger: SeedLogger) {}

  async run(prisma: PrismaClient): Promise<void> {
    this.logger.info(`Starting ${this.name} seeding...`);

    // Your seeding logic here
    const result = await prisma.customModel.create({
      data: {
        /* ... */
      },
    });

    this.logger.success(`${this.name} seeding completed`);
  }
}
```

### 2. Register Module

```typescript
import { SeedOrchestrator } from "./.seed";
import { CustomSeedModule } from "./modules/custom";

const orchestrator = new SeedOrchestrator();
orchestrator.addModule(new CustomSeedModule(orchestrator.logger));
await orchestrator.runAll(prisma);
```

## 🛠️ Utilities

### Logger

```typescript
import { ConsoleSeedLogger } from "./.seed/utils";

const logger = new ConsoleSeedLogger(true); // verbose
logger.info("Information message");
logger.success("Success message");
logger.warn("Warning message");
logger.error("Error message");
```

### Environment Variables

```typescript
import { getRequiredEnvVar, getOptionalEnvVar } from "./.seed/utils";

const required = getRequiredEnvVar("DATABASE_URL");
const optional = getOptionalEnvVar("LOG_LEVEL", "info");
```

### Batch Processing

```typescript
import { processBatch } from "./.seed/utils";

const results = await processBatch(
  items,
  async (item) => await processItem(item),
  10, // batch size
);
```

## ⚙️ Environment Variables

Required for user seeding:

- `SUPER_ADMIN_NIP`: Super admin NIP number
- `SUPER_ADMIN_PASSWORD`: Super admin password

## 🔒 Data Safety

- **Idempotent**: Safe to run multiple times
- **Existence Checks**: Skips existing records
- **Transactions**: Uses Prisma transactions where appropriate
- **Error Handling**: Comprehensive error handling with clear messages

## 📝 Execution Order

Modules run in dependency order:

1. **Organizations** - Must exist before users that reference them
2. **Users** - Can reference organizations via `organizationSigla`

## 🎯 Best Practices

### Module Design

- Implement the `SeedModule` interface
- Use dependency injection for logger
- Include existence checks to prevent duplicates
- Provide clear logging messages
- Handle errors gracefully

### Data Structure

- Define data interfaces in `types.ts`
- Keep data separate from logic
- Use meaningful names and descriptions
- Document relationships and dependencies

### Testing

- Test modules independently
- Verify idempotent behavior
- Test error scenarios
- Validate data integrity

## 🚨 Troubleshooting

### Common Issues

**Environment Variables Missing**

```
Error: Environment variable SUPER_ADMIN_NIP is required but not set
```

Solution: Set required variables in `.env` file

**Dependency Order**

```
Error: Parent organization CSupAb not found
```

Solution: Ensure parent organizations are created first

**Duplicate Key Errors**

```
Error: Unique constraint failed on the fields: (`sigla`)
```

Solution: Modules should check for existing records

### Debug Mode

Enable verbose logging for detailed output:

```typescript
await runAllSeeds(prisma, { verbose: true });
```

## 🎉 Contributing

When adding new seed modules:

1. Create module in `.seed/modules/`
2. Implement `SeedModule` interface
3. Add to `modules/index.ts` exports
4. Update this README
5. Add to default orchestrator if needed
6. Test thoroughly

---

_This seed system follows SOLID principles and clean code practices to ensure maintainability and extensibility._
