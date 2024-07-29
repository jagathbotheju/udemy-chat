"use server";
import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { Like, Member } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getLikedMembers = async (type = "source") => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "UnAuthorized",
      };
    }

    switch (type) {
      case "source":
        return await getSourceLikes(userId);
      case "target":
        return await getTargetLikes(userId);
      case "mutual":
        return await getMutualLikes(userId);
      default:
        return [];
    }

    return {
      success: false,
      error: "Unable to get liked members, please try again",
    };
  } catch (error) {
    console.log("getLikedMembers", error);
    return {
      success: false,
      error: "Internal Server Error, getting licked members",
    };
  }
};

const getSourceLikes = async (userId: string) => {
  const sourceList = await prisma.like.findMany({
    where: {
      sourceUserId: userId,
    },
    select: {
      targetMember: true,
    },
  });
  return sourceList.map((item) => item.targetMember);
};

const getTargetLikes = async (userId: string) => {
  const targetList = await prisma.like.findMany({
    where: {
      targetUserId: userId,
    },
    select: {
      sourceMember: true,
    },
  });
  return targetList.map((item) => item.sourceMember);
};

const getMutualLikes = async (userId: string) => {
  const likedUsers = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetUserId: true },
  });
  const likedIds = likedUsers.map((item) => item.targetUserId);

  const mutualList = await prisma.like.findMany({
    where: {
      AND: {
        targetUserId: userId,
        sourceUserId: { in: likedIds },
      },
    },
    select: { sourceMember: true },
  });

  return mutualList.map((item) => item.sourceMember);
};

export const toggleLikeMember = async (
  targetUserId: string,
  isLiked: boolean
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "UnAuthorized",
      };
    }

    let liked = null;
    let unLiked = null;
    if (isLiked) {
      unLiked = await prisma.like.delete({
        where: {
          sourceUserId_targetUserId: {
            sourceUserId: userId,
            targetUserId,
          },
        },
      });
    } else {
      liked = await prisma.like.create({
        data: {
          sourceUserId: userId,
          targetUserId,
        },
        select: {
          sourceMember: {
            select: {
              name: true,
              image: true,
              userId: true,
            },
          },
        },
      });
    }

    if (liked || unLiked) {
      revalidatePath("/members");

      if (liked) {
        await pusherServer.trigger(`private-${targetUserId}`, "like-new", {
          name: liked.sourceMember.name,
          image: liked.sourceMember.image,
          userId: liked.sourceMember.userId,
        });
      }
      return {
        success: true,
        message: "Likes updated successfully",
      };
    }

    return {
      success: false,
      error: "Could not like member, please try again later.",
    };
  } catch (error) {
    console.log("toggleLikeMember", error);
    return {
      success: false,
      error: "Internal Server Error, liking member",
    };
  }
};

export const getCurrentUserLikeIds = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "UnAuthorized",
      };
    }

    const likeIds = await prisma.like.findMany({
      where: {
        sourceUserId: userId,
      },
      select: {
        targetUserId: true,
      },
    });

    if (likeIds) {
      return {
        success: true,
        likeIds: likeIds.map((id) => id.targetUserId),
      };
    }

    return {
      success: false,
      error: "Could not get current user likes, please try again later.",
    };
  } catch (error) {
    console.log("toggleLikeMember", error);
    return {
      success: false,
      error: "Internal Server Error, getting likes",
    };
  }
};
