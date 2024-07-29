import { Member, Message } from "@prisma/client";

type MessageExt = Message & {
  sender: Member;
  receiver: Member;
};

type TableCellType = {
  key: string;
  name: string;
  text: string;
  createdAt: string;
  dateRead: Date | null;
  receiver: Member;
  sender: Member;
  messageId: string;
};
