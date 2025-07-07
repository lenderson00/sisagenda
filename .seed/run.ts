import { prisma } from '../src/lib/prisma';
import { runAllSeeds } from '.';

async function main() {
  try {
    await runAllSeeds(prisma, { verbose: true });
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
