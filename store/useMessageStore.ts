import { MessageExt } from "@/lib/types";
import { Message } from "@prisma/client";
import { create } from "zustand";

type MessageState = {
  messages: MessageExt[];
  unRedCount: number;
  add: (message: MessageExt) => void;
  remove: (id: string) => void;
  updateUnreadCount: (count: number) => void;
  set: (messages: MessageExt[]) => void;
};

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  unRedCount: 0,
  add: (message) =>
    set((state) => ({ messages: [message, ...state.messages] })),
  remove: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  set: (messages) => {
    set({ messages });
  },
  updateUnreadCount: (count) => {
    console.log(count);
    return set((state) => ({
      unRedCount: state.unRedCount + count,
    }));
  },
}));
