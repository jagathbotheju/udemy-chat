"use client";
import { Image, Card, CardFooter } from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { calculateAge } from "@/lib/utils";
import LikeButton from "@/components/LikeButton";
import React from "react";
import PresenceIndicator from "@/components/PresenceIndicator";

interface Props {
  member: Member;
  likeIds: string[] | undefined;
}

const MemberCard = ({ member, likeIds }: Props) => {
  const hasLiked = likeIds ? likeIds.includes(member.userId) : false;

  const preventPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card
      isPressable
      as={Link}
      className="relative"
      href={`/members/${member.userId}`}
    >
      <Image
        isZoomed
        alt={member.name}
        className="aspect-square object-cover"
        src={member.image || "/images/user.png"}
        width={300}
      />
      <CardFooter className="flex justify-start bg-gradient-to-b from-transparent to-slate-800 overflow-hidden absolute bottom-0 z-10">
        <div className="flex flex-col text-white">
          <span className="font-semibold">
            {member.name.trim()}, {calculateAge(member.dateOfBirth)}
          </span>
          <span className="text-sm">{member.city.trim()}</span>
        </div>
      </CardFooter>

      {/* like button */}
      <div
        role="button"
        className="absolute top-2 right-2 z-50"
        onClick={preventPropagation}
      >
        <LikeButton hasLiked={hasLiked} targetId={member.userId} />
      </div>
      <div className="absolute top-1 left-1 z-50">
        <PresenceIndicator member={member} />
      </div>
    </Card>
  );
};

export default MemberCard;
