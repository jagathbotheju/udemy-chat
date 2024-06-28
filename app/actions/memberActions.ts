"use server";
import prisma from "@/lib/prisma";
import { membersData } from "@/prisma/memberData";
import { hash } from "bcryptjs";

export const seedMembers = async () => {
  try {
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
                createdAt: new Date(member.created),
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

    console.log("seed OK");

    return {
      success: false,
      error: "Unable to seed DB",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Sever Error ,seeding members",
    };
  }
};
