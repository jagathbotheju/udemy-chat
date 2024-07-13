import { Member, Message } from "@prisma/client";

type MessageExt = Message & {
  sender: Member;
  receiver: Member;
};
