import { prisma } from "../src/lib/prisma";
import { runAllSeeds } from "../.seed";

async function main() {
  try {
    await runAllSeeds(prisma, { verbose: true });
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
