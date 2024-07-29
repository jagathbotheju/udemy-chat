import PresenceAvatar from "@/components/PresenceAvatar";
import { MessageExt, TableCellType } from "@/lib/types";
import { Button, cn } from "@nextui-org/react";
import { Message } from "@prisma/client";
import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { format } from "date-fns";

interface Props {
  item: MessageExt;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (item: MessageExt) => void;
  isDeleting: boolean;
}

const MessageTableCell = ({
  item,
  columnKey,
  isOutbox,
  deleteMessage,
  isDeleting,
}: Props) => {
  switch (columnKey) {
    case "name":
      return (
        <div
          className={cn("flex items-center gap-2 cursor-pointer", {
            "font-semibold": !item.dateRead && !isOutbox,
          })}
        >
          <PresenceAvatar
            src={isOutbox ? item.receiver.image : item.sender.image}
            userId={isOutbox ? item.receiver.userId : item.sender.userId}
          />
          <span>{isOutbox ? item.receiver.name : item.sender.name}</span>
        </div>
      );

    case "text":
      return (
        <div className="text-wrap text-justify line-clamp-2">{item.text}</div>
      );

    case "createdAt":
      return (
        <div className="text-nowrap">
          <span>{format(item.createdAt, "yyyy-MM-dd")}</span>
        </div>
      );

    default:
      return (
        isOutbox && (
          <Button
            isIconOnly
            // isLoading={isDeleting}
            variant="light"
            onClick={async () => deleteMessage(item)}
          >
            <AiFillDelete className="text-danger" size={18} />
          </Button>
        )
      );
  }
};

export default MessageTableCell;
