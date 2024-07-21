"use client";
import { MessageExt } from "@/lib/types";
import React, { useCallback, useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { User } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";

interface Props {
  initMessages: MessageExt[];
  currentUser: User;
  chatID: string;
}

const ChatCards = ({ initMessages, currentUser, chatID }: Props) => {
  const [messages, setMessages] = useState(initMessages);

  const handleNewMessage = useCallback((message: MessageExt) => {
    setMessages((prevMessages) => {
      return [...prevMessages, message];
    });
  }, []);

  const handleReadMessages = useCallback((messageIds: string[]) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: new Date() }
          : message
      )
    );
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe(chatID);
    channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);

    return () => {
      channel.unsubscribe();
      channel.unbind("message:new", handleNewMessage);
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatID, handleNewMessage, handleReadMessages]);

  return (
    <div className="flex flex-col w-full gap-3">
      {messages.map((message) => (
        <ChatCard
          key={message.id}
          currentUser={currentUser}
          message={message}
        />
      ))}
    </div>
  );
};

export default ChatCards;
