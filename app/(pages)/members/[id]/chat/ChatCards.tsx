"use client";
import { MessageExt } from "@/lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatCard from "./ChatCard";
import { User } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";
import { useMessageStore } from "@/store/useMessageStore";

interface Props {
  initMessages: MessageExt[];
  currentUser: User;
  chatID: string;
  redCount?: number;
}

const ChatCards = ({
  initMessages,
  currentUser,
  chatID,
  redCount = 0,
}: Props) => {
  const setRedCount = useRef(false);
  const { updateUnreadCount } = useMessageStore((state) => state);
  const [messages, setMessages] = useState(initMessages);

  const handleNewMessage = useCallback(
    (message: MessageExt) => {
      setMessages((prevMessages) => {
        return [...prevMessages, message];
      });
    },
    [messages]
  );

  useEffect(() => {
    setMessages(initMessages);
    if (!setRedCount.current) {
      updateUnreadCount(-redCount);
      setRedCount.current = true;
    }
  }, [initMessages, setMessages, redCount, updateUnreadCount]);

  const handleReadMessages = useCallback(
    (messageIds: string[]) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          messageIds.includes(message.id)
            ? { ...message, dateRead: new Date() }
            : message
        )
      );
    },
    [messages]
  );

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
