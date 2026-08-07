import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin/developer account
  const adminUsername = "admin0987";
  const adminPassword = "pwnya admin?0987#$@";

  const [existing] = await db.select().from(users).where(eq(users.username, adminUsername)).limit(1);
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await db.insert(users).values({
      username: adminUsername,
      password: hashed,
      role: "developer",
      expiresAt: undefined,
      isActive: true,
    });
    console.log("✅ Developer account created:", adminUsername);
  } else {
    console.log("ℹ️ Developer account already exists");
  }

  // Create demo accounts
  const demos = [
    { username: "reseller01", password: "reseller123", role: "reseller", days: 30 },
    { username: "user01", password: "user123", role: "user", days: 7 },
  ];

  for (const demo of demos) {
    const [ex] = await db.select().from(users).where(eq(users.username, demo.username)).limit(1);
    if (!ex) {
      const hashed = await bcrypt.hash(demo.password, 12);
      const exp = new Date();
      exp.setDate(exp.getDate() + demo.days);
      await db.insert(users).values({
        username: demo.username,
        password: hashed,
        role: demo.role,
        expiresAt: exp,
        isActive: true,
      });
      console.log(`✅ Demo account created: ${demo.username} (${demo.role})`);
    }
  }

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
