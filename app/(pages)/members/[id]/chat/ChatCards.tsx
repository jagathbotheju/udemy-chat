import { MessageExt } from "@/lib/types";
import React from "react";
import ChatCard from "./ChatCard";
import { User } from "@prisma/client";

interface Props {
  messages: MessageExt[];
  currentUser: User;
}

const ChatCards = ({ messages, currentUser }: Props) => {
  return (
    <div className="flex flex-col w-full gap-3">
      {messages.map((message) => (
        <ChatCard
          key={message.id}
          message={message}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default ChatCards;
