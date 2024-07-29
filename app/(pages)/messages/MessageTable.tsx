"use client";
import { MessageExt } from "@/lib/types";
import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import _ from "lodash";
import MessageTableCell from "./MessageTableCell";
import { useMessages } from "@/hooks/useMessages";
import { useMessageStore } from "@/store/useMessageStore";

interface Props {
  initMessages: MessageExt[];
}

const MessageTable = ({ initMessages }: Props) => {
  const {
    isOutbox,
    columns,
    tableMessages,
    isDeleting,
    deleteMessage,
    selectRow,
    messages,
  } = useMessages(initMessages);
  const { set } = useMessageStore((state) => state);

  useEffect(() => {
    set(initMessages);
  }, []);

  return (
    <Table
      aria-label="table with messages"
      selectionMode="single"
      onRowAction={(key) => selectRow(key)}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent="No Messages Found" items={tableMessages}>
        {(item) => (
          <TableRow
            key={item.id}
            className="cursor-pointer border border-primary-100 rounded-md"
          >
            {(columnKey) => (
              <TableCell>
                <div
                  className={cn({
                    "font-semibold": !isOutbox && !item.dateRead,
                  })}
                >
                  <MessageTableCell
                    columnKey={columnKey as string}
                    deleteMessage={() => deleteMessage(item)}
                    isDeleting={isDeleting}
                    isOutbox={isOutbox}
                    item={item}
                  />
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
