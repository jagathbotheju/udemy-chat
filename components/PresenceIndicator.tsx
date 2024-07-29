import { usePresenceStore } from "@/store/usePresenceStore";
import { Member } from "@prisma/client";
import React from "react";
import { GoDot, GoDotFill } from "react-icons/go";

interface Props {
  member: Member;
}

const PresenceIndicator = ({ member }: Props) => {
  const { members } = usePresenceStore((store) => store);
  const isOnline = members.indexOf(member.userId) !== -1;

  if (!isOnline) return null;

  return (
    <div>
      <GoDot
        className="fill-white absolute -top-[2px] -right-[2px]"
        size={36}
      />
      <GoDotFill
        className="fill-green-500 animate-ping duration-700"
        size={32}
      />
    </div>
  );
};

export default PresenceIndicator;
