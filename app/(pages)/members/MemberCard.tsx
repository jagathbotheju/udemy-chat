import { Image, Card, CardFooter } from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { calculateAge } from "@/lib/utils";

interface Props {
  member: Member;
}

const MemberCard = ({ member }: Props) => {
  return (
    <Card as={Link} href={`/members/${member.userId}`} isPressable>
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
    </Card>
  );
};

export default MemberCard;
