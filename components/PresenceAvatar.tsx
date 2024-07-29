"use client";
import { usePresenceStore } from "@/store/usePresenceStore";
import { Avatar, Badge } from "@nextui-org/react";
import React from "react";

interface Props {
  userId?: string;
  src?: string | null;
}

const PresenceAvatar = ({ userId, src }: Props) => {
  const { members } = usePresenceStore((state) => state);
  const isOnline = userId && members.indexOf(userId) !== -1;

  return (
    <Badge color="success" content="" isInvisible={!isOnline} shape="circle">
      <Avatar alt="user avatar" src={src || "/images/blank-profile.png"} />
    </Badge>
  );
};

export default PresenceAvatar;
