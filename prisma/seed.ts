import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HANGOVA database...");

  // Create a test group
  const group = await prisma.group.upsert({
    where: { code: "HANGOVA01" },
    update: {},
    create: {
      name: "The Crew",
      code: "HANGOVA01",
      isPublic: false,
    },
  });
  console.log(`✅ Group created: ${group.name} (code: ${group.code})`);

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hangova.app" },
    update: {},
    create: {
      name: "Admin",
      username: "admin",
      email: "admin@hangova.app",
      password: hashedPassword,
      isAdmin: true,
      groupId: group.id,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create a test user
  const userPassword = await bcrypt.hash("user123", 12);
  const testUser = await prisma.user.upsert({
    where: { email: "user@hangova.app" },
    update: {},
    create: {
      name: "Test User",
      username: "testuser",
      email: "user@hangova.app",
      password: userPassword,
      groupId: group.id,
    },
  });
  console.log(`✅ Test user created: ${testUser.email}`);

  // Seed some sample content (YouTube embeds — safe to seed without upload)
  const sampleMovies = [
    {
      type: "movie" as const,
      source: "youtube" as const,
      youtubeVideoId: "dQw4w9WgXcQ",
      title: "Sample Movie 1",
      description: "A great movie to watch with the crew",
      thumbnailUrl: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
      genre: "Drama",
      isFeatured: true,
    },
    {
      type: "movie" as const,
      source: "youtube" as const,
      youtubeVideoId: "LXb3EKWsInQ",
      title: "Sample Movie 2",
      description: "Another crew favorite",
      thumbnailUrl: `https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg`,
      genre: "Action",
    },
  ];

  for (const movie of sampleMovies) {
    await prisma.content.upsert({
      where: {
        // Use a synthetic unique check via findFirst since there's no unique constraint on youtubeVideoId
        id: `seed-${movie.youtubeVideoId}`,
      },
      update: {},
      create: {
        id: `seed-${movie.youtubeVideoId}`,
        ...movie,
        groupId: group.id,
        uploadedById: admin.id,
      },
    });
  }
  console.log(`✅ Sample content seeded`);

  console.log("\n🎉 Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin:     admin@hangova.app / admin123");
  console.log("  User:      user@hangova.app  / user123");
  console.log("  Group code: HANGOVA01");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
