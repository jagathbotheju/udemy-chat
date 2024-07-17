"use server";
import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { MessageSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/*******************DELETE CHAT MESSAGE ************************* */
export const deleteMessage = async ({
  senderId,
  messageId,
}: {
  senderId: string;
  messageId: string;
}) => {
  try {
    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    if (deletedMessage) {
      revalidatePath(`/messages`);
      revalidatePath(`/members/${senderId}/chat`);
      return {
        success: true,
        message: "Message deleted successfully",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, deleting message",
    };
  }
};

/*******************GET CHAT MESSAGES **************************** */
export const getChatMessages = async (receiverId: string) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: user.id,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        dateRead: true,
        sender: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (messages) {
      revalidatePath(`/members/${receiverId}/chat`);
      await prisma.message.updateMany({
        where: {
          senderId: receiverId,
          receiverId: user.id,
        },
        data: { dateRead: new Date() },
      });
      return {
        success: true,
        data: messages,
      };
    }

    return {
      success: false,
      error: "Unable to get chat messages, please try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, getting chat messages",
    };
  }
};

/*******************GET MESSAGES BY CONTAINER/INBOX/OUTBOX********* */
export const getMessagesByContainer = async (container: string) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    const selector = container === "outbox" ? "senderId" : "receiverId";
    const messages = await prisma.message.findMany({
      where: {
        [selector]: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        dateRead: true,
        sender: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (messages) {
      revalidatePath("/members/messages");
      return {
        success: true,
        data: messages,
      };
    }

    return {
      success: false,
      error: "Unable to get messages, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, getting messages",
    };
  }
};

/*******************CREATE MESSAGE************************** */
export const createMessage = async (
  receiverUserId: string,
  formData: z.infer<typeof MessageSchema>
) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    const valid = MessageSchema.safeParse(formData);
    if (!valid.success)
      return {
        success: false,
        error: "Invalid Data!",
      };

    const message = await prisma.message.create({
      data: {
        text: formData.text,
        receiverId: receiverUserId,
        senderId: user.id,
      },
    });

    if (message) {
      revalidatePath(`/members/${receiverUserId}/chat`);
      return {
        success: true,
        message: "Message created successfully",
        data: message,
      };
    }

    return {
      success: false,
      error: "Could not create message, please try later",
    };
  } catch (error: any) {
    console.log("catching error ###########", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};
