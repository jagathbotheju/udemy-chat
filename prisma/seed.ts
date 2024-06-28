import { PrismaClient } from "@prisma/client";
import { membersData } from "./memberData";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const seedMembers = async () => {
  membersData.map(
    async (member) =>
      await prisma.user.create({
        data: {
          email: member.email,
          emailVerified: new Date(),
          name: member.name,
          passwordHash: await hash("password", 10),
          image: member.image,
          member: {
            create: {
              dateOfBirth: new Date(member.dateOfBirth),
              gender: member.gender,
              name: member.name,
              createdAt: member.created,
              updatedAt: new Date(member.lastActive),
              description: member.description,
              city: member.city,
              country: member.country,
              image: member.image,
              photos: {
                create: {
                  url: member.image,
                },
              },
            },
          },
        },
      })
  );
  console.log("seeding completed...");
};

const main = async () => {
  await seedMembers();
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
