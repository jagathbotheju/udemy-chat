import { pusherClient } from "@/lib/pusher";
import { Message } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import { useMessageStore } from "./useMessageStore";
import { toast } from "sonner";
import { MessageExt } from "@/lib/types";
import { newLikeToast, newMessageToast } from "@/components/NotificationToast";

export const useNotificationChannel = (userId: string | null) => {
  const channelRef = useRef<Channel | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { add, updateUnreadCount, unRedCount } = useMessageStore(
    (state) => state
  );

  const handleNewLike = (data: {
    name: string;
    image: string | null;
    userId: string;
  }) => newLikeToast(data.name, data.image, data.userId);

  const handleNewMessage = useCallback(
    (message: MessageExt) => {
      if (
        pathname === "/messages" &&
        searchParams.get("container") !== "outbox"
      ) {
        add(message);
        updateUnreadCount(unRedCount + 1);
      } else if (pathname !== `/members/${message.senderId}/chat`) {
        // toast.info(`New message from ${message.sender.name}`);
        newMessageToast(message);
        updateUnreadCount(unRedCount + 1);
      }
    },
    [add, pathname, searchParams, updateUnreadCount]
  );

  useEffect(() => {
    if (!userId) return;
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-${userId}`);
      channelRef.current.bind("message:new", handleNewMessage);
      channelRef.current.bind("like:new", handleNewLike);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind("message:new", handleNewMessage);
        channelRef.current.unbind("like:new", handleNewLike);
        channelRef.current = null;
      }
    };
  }, [userId, handleNewMessage]);
};
