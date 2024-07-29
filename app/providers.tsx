"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { usePresenceChannel } from "@/store/usePresenceChannel";
import { useNotificationChannel } from "@/store/useNotificationChannel";
import { useMessageStore } from "@/store/useMessageStore";
import { getUnreadMessageCount } from "./actions/messageActions";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  userId: string | null;
}

export function Providers({ children, themeProps, userId }: ProvidersProps) {
  const { updateUnreadCount } = useMessageStore((state) => state);
  const router = useRouter();
  usePresenceChannel();
  useNotificationChannel(userId);

  const setUnreadCount = React.useCallback(
    (count: number) => {
      updateUnreadCount(count);
    },
    [updateUnreadCount]
  );

  React.useEffect(() => {
    getUnreadMessageCount().then((res) => {
      if (res.success && res.data) {
        setUnreadCount(res.data);
      }
    });
  }, [setUnreadCount]);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster richColors />
      </NextThemesProvider>
    </NextUIProvider>
  );
}
