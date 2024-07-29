"use server";
import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { MessageSchema } from "@/lib/schema";
import { createChatID } from "@/lib/utils";
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

    return {
      success: false,
      error: "Could not delete message, please try again later",
    };
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
      select: messageSelect,
    });

    let redCount = 0;

    if (messages) {
      const readMessageIds = messages
        .filter(
          (message) =>
            message.dateRead === null &&
            message.receiver?.userId === user.id &&
            message.sender?.userId === receiverId
        )
        .map((message) => message.id);

      redCount = readMessageIds.length;
      revalidatePath(`/members/${receiverId}/chat`);

      await prisma.message.updateMany({
        where: { id: { in: readMessageIds } },
        data: { dateRead: new Date() },
      });
      await pusherServer.trigger(
        createChatID(receiverId, user.id),
        "messages:read",
        readMessageIds
      );
      return {
        success: true,
        data: { messages, redCount },
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
      select: messageSelect,
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
      select: messageSelect,
    });

    if (message) {
      revalidatePath(`/members/${receiverUserId}/chat`);
      revalidatePath(`/members/${message.sender?.userId}/chat`);
      revalidatePath("/messages");
      //server side pusher config
      //client need to subscribe to this channel
      await pusherServer.trigger(
        createChatID(user.id, receiverUserId),
        "message:new",
        message
      );
      await pusherServer.trigger(
        `private-${receiverUserId}`,
        "message:new",
        message
      );

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
    return {
      success: false,
      error: error.message,
    };
  }
};

/*******************GET UNREAD MESSAGE COUNT*********************** */
export const getUnreadMessageCount = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) redirect("/auth/login");

    const messageCount = await prisma.message.count({
      where: {
        receiverId: user.id,
        dateRead: null,
        receiverDeleted: false,
      },
    });

    if (messageCount) {
      return {
        success: true,
        data: messageCount,
      };
    }

    return {
      success: false,
      error: "Unable to get unread message count, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, getting unread message count",
    };
  }
};

const messageSelect = {
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
};
