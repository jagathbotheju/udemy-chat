"use client";
import { Image, Card, CardFooter } from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { calculateAge } from "@/lib/utils";
import LikeButton from "@/components/LikeButton";
import React from "react";

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
      as={Link}
      href={`/members/${member.userId}`}
      isPressable
      className="relative"
    >
      <Image
        isZoomed
        alt={member.name}
        width={300}
        src={member.image || "/images/user.png"}
        className="aspect-square object-cover"
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
      <div className="absolute top-2 right-2 z-50" onClick={preventPropagation}>
        <LikeButton targetId={member.userId} hasLiked={hasLiked} />
      </div>
    </Card>
  );
};

export default MemberCard;
