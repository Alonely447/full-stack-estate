import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

async function createAdmin() {
  const username = "admin";
  const email = "admin@example.com";
  const password = "admin"; // Change to a secure password

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin: true,
        isAdminVerified: true,
        isEmailVerified: true,
      },
    });

    console.log("Admin user created successfully:", adminUser);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
