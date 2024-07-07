"use server";
import { auth } from "@/config/auth";
import { cloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { MemberEditSchema } from "@/lib/schema";
import { membersData } from "@/prisma/memberData";
import { user } from "@nextui-org/react";
import { Photo } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/******************DELETE IMAGE************************* */
export const deleteImage = async ({
  photo,
  profilePhoto,
}: {
  photo: Photo;
  profilePhoto: string | null;
}) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    if (
      user.image === photo.url ||
      (profilePhoto && profilePhoto === photo.url)
    ) {
      return {
        success: false,
        error: "Could not delete Profile Image",
      };
    }

    let cloudImageDelete = "";
    if (photo.publicId) {
      cloudImageDelete = await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    const localImageDelete = await prisma.member.update({
      where: {
        userId: user.id,
      },
      data: {
        photos: {
          delete: {
            id: photo.id,
          },
        },
      },
    });

    if (cloudImageDelete === "ok" || localImageDelete) {
      revalidatePath("/members/myprofile/photos");
      return {
        success: true,
        message: "Photo deleted successfully",
      };
    }

    return {
      success: false,
      error: "Unable to delete image, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, deleting image",
    };
  }
};

/******************SET MAIN IMAGE************************* */
export const setMainImage = async (photoUrl: string) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    const userUpdatePromise = prisma.user.update({
      where: { id: user.id },
      data: { image: photoUrl },
    });

    const memberUpdatePromise = prisma.member.update({
      where: { userId: user.id },
      data: { image: photoUrl },
    });

    const [userUpdate, memberUpdate] = await Promise.all([
      userUpdatePromise,
      memberUpdatePromise,
    ]);
    if (userUpdate && memberUpdate) {
      return {
        success: true,
        message: "Profile Image updated, successfully",
      };
    }

    return {
      success: false,
      error: "Could not set main image, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, setting main image",
    };
  }
};

/******************ADD IMAGES************************* */
export const addImages = async (url: string, publicId: string) => {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/auth/login");

  try {
    const updatedUser = await prisma.member.update({
      where: {
        userId: user.id,
      },
      data: {
        photos: {
          create: [
            {
              url,
              publicId,
            },
          ],
        },
      },
    });

    if (updatedUser) {
      revalidatePath("/myprofile");
      return {
        success: true,
        message: "Photos uploaded successfully",
      };
    }

    return {
      success: false,
      error: "Unable to upload images, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, adding images",
    };
  }
};

/******************UPDATE MEMBER PROFILE************************* */
export const updateMemberProfile = async ({
  data,
  userId,
}: {
  data: z.infer<typeof MemberEditSchema>;
  userId: string;
}) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return {
        success: false,
        error: "Not Authorized",
      };
    }

    const isValid = MemberEditSchema.safeParse(data);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid data",
      };
    }

    const updatedMember = await prisma.member.update({
      where: {
        userId,
      },
      data,
    });

    if (updatedMember) {
      revalidatePath("/members/myprofile");
      return {
        success: true,
        message: "Profile updated successfully",
      };
    }

    return {
      success: false,
      error: "Could not update profile, please try again later",
    };
  } catch (error) {
    console.log("updateMemberProfile", error);
    return {
      success: false,
      error: "Internal Server Error, updating profile",
    };
  }
};

/******************SEED MEMBERS************************* */
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
