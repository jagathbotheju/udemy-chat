"use client";
import { MessageExt } from "@/lib/types";
import {
  Avatar,
  Button,
  cn,
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Key, useCallback } from "react";
import _ from "lodash";
import { AiFillDelete } from "react-icons/ai";
import { z } from "zod";
import { deleteMessage } from "@/app/actions/messageActions";
import { toast } from "sonner";

interface Props {
  messages: MessageExt[];
}

const MessageTable = ({ messages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";

  const tableMessages = messages.map((message) => ({
    key: message.id,
    name: isOutbox ? message.receiver.name : message.sender.name,
    text: message.text,
    createdAt: message.createdAt.toDateString(),
    dateRead: message.dateRead,
    receiver: message.receiver,
    sender: message.sender,
    messageId: message.id,
  }));

  const columns = [
    {
      key: "name",
      label: isOutbox ? "Receiver" : "Sender",
    },
    { key: "text", label: "Message" },
    { key: "createdAt", label: isOutbox ? "Date Sent" : "Date Received" },
    { key: "actions", label: "Actions" },
  ];

  const handleRowSelect = (key: Key) => {
    const message = messages.find((message) => message.id === key);
    const url = isOutbox
      ? `/members/${message?.receiver.userId}`
      : `/members/${message?.sender.userId}`;
    console.log("MessageTable url", url + "/chat");
    console.log(message);
    router.push(url + "/chat");
  };

  const handleDeleteMessage = () => {};

  const renderCell = useCallback(
    (item: (typeof tableMessages)[0], columnKey: string) => {
      switch (columnKey) {
        case "name":
          return (
            <div
              className={cn("flex items-center gap-2 cursor-pointer", {
                "font-semibold": !item.dateRead && !isOutbox,
              })}
            >
              <Avatar
                alt="member"
                className="shrink-0"
                src={
                  (isOutbox ? item.receiver.image : item.sender.image) ||
                  "/images/blank-profile.png"
                }
              />
              <span>{item.name}</span>
            </div>
          );

        case "text":
          return (
            <div className="text-wrap text-justify line-clampde">
              {item.text}
            </div>
          );

        case "createdAt":
          return <div className="text-nowrap">{item.createdAt}</div>;

        default:
          return (
            isOutbox && (
              <Button
                isIconOnly
                variant="light"
                onClick={async () =>
                  deleteMessage({
                    messageId: item.messageId,
                    senderId: item.sender.userId,
                  })
                    .then((res) => {
                      if (res?.success) {
                        return toast.success(res.message);
                      } else {
                        return toast.error(res?.error);
                      }
                    })
                    .catch(() => {
                      return toast.error(
                        "Internal Server Error,deleting message"
                      );
                    })
                }
              >
                <AiFillDelete size={18} className="text-danger" />
              </Button>
            )
          );
      }
    },
    [isOutbox]
  );

  return (
    <Table
      aria-label="table with messages"
      selectionMode="single"
      onRowAction={(key) => handleRowSelect(key)}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        // items={isOutbox ? rowsReceiver : rowsSender}
        items={tableMessages}
        emptyContent="No Messages Found"
      >
        {(item) => (
          <TableRow
            key={item.key}
            className="cursor-pointer border border-primary-100 rounded-md"
          >
            {(columnKey) => (
              <TableCell>
                <div
                  className={cn({
                    "font-semibold": !isOutbox && !item.dateRead,
                  })}
                >
                  {/* {getKeyValue(item, columnKey)} */}
                  {renderCell(item, columnKey as string)}
                </div>
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MessageTable;
