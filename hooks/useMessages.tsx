import { MessageExt, TableCellType } from "@/lib/types";

import { useRouter, useSearchParams } from "next/navigation";
import { Key, useEffect, useTransition } from "react";
import _ from "lodash";
import { deleteMessage } from "@/app/actions/messageActions";
import { toast } from "sonner";
import { useMessageStore } from "@/store/useMessageStore";

export const useMessages = (initMessages: MessageExt[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const [isPending, startTransition] = useTransition();
  const { set, remove, messages, updateUnreadCount, unRedCount } =
    useMessageStore((state) => state);

  useEffect(() => {
    set(initMessages);
  }, [initMessages, set]);

  const tableMessages = messages.map((message) => ({
    ...message,
    name: isOutbox ? message.receiver.name : message.sender.name,
    text: message.text,
    createdAt: message.createdAt,
    key: message.id,
    dateRead: message.dateRead,
    receiver: message.receiver,
    sender: message.sender,
    messageId: message.id,
  })) as MessageExt[];

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
    const message = initMessages.find((message) => message.id === key);
    const url = isOutbox
      ? `/members/${message?.receiver.userId}`
      : `/members/${message?.sender.userId}`;
    router.push(url + "/chat");
  };

  const handleDeleteMessage = (item: MessageExt) => {
    startTransition(() => {
      deleteMessage({
        senderId: item.sender.userId,
        messageId: item.id,
      })
        .then((res) => {
          if (res.success) {
            remove(item.id);
            if (!item.dateRead && !isOutbox) {
              updateUnreadCount(-1);
            }
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          return toast.error(err.error);
        });
    });
  };

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting: isPending,
    tableMessages,
    messages,
  };
};
