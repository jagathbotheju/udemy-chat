"use client";
import { MessageExt } from "@/lib/types";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar, cn, Divider } from "@nextui-org/react";
import { User } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";

interface Props {
  message: MessageExt;
  currentUser: User;
}

const ChatCard = ({ message, currentUser }: Props) => {
  const isCurrentUserSender = message.sender.userId === currentUser.id;
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [endRef]);

  return (
    <div
      className={cn("w-fit max-w-[50%] rounded-md relative flex gap-1 mx-5", {
        "self-end": message.sender.userId === currentUser.id,
      })}
    >
      <Card>
        <CardBody className="text-sm">{message.text}</CardBody>
        <CardFooter className="bg-slate-100 py-[2px]">
          <div className="flex flex-col">
            <div className="flex">
              <span className="text-xs font-semibold text-gray-900">
                {message.sender.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {message.createdAt.toDateString()}
              </span>
              <div className="flex self-end">
                {message.dateRead && message.receiverId !== currentUser.id ? (
                  <IoCheckmarkDoneSharp className="text-green-500" />
                ) : (
                  <IoCheckmarkSharp className="text-green-500" />
                )}
              </div>
            </div>
          </div>
          <div ref={endRef}></div>
        </CardFooter>
      </Card>

      <Avatar
        showFallback
        src={message.sender.image as string}
        className={cn("absolute bottom-0 ", {
          "-left-8 -bottom-2": message.sender.userId === currentUser.id,
          "-right-8 -bottom-2": message.sender.userId !== currentUser.id,
        })}
      />
    </div>
  );
};

export default ChatCard;
