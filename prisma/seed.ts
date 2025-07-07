import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const nip = process.env.SUPER_ADMIN_NIP;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!nip || !password) {
    throw new Error(
      "SUPER_ADMIN_NIP and SUPER_ADMIN_PASSWORD must be set in .env",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: "superadmin@example.com",
      nip,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      name: "Super Admin",
      mustChangePassword: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
