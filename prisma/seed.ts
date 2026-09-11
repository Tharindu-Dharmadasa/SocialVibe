import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting database seeding...');

    // 1. Optional: Clean up existing test users to prevent unique constraint errors on rerun
    console.log('🧹 Cleaning up old test users...');
    await prisma.user.deleteMany({
        where: {
            email: {
                contains: '@example.com',
            },
        },
    });

    // 2. Loop to create 50 users
    console.log('🌱 Seeding 50 test users...');
    for (let i = 1; i <= 50; i++) {
        await prisma.user.create({
            data: {
                clerkId: `test_clerk_${i}`,
                email: `user${i}@example.com`,
                userName: `user_${i}`,
                name: `User ${i}`,
            },
        });
    }

    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        // Disconnect from the database when done
        await prisma.$disconnect();
    });
