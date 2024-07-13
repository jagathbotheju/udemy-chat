"use server";
import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { MessageSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
