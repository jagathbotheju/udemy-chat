"use client";
import { calculateAge } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  cn,
  Divider,
  Image,
} from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

const MemberSidebar = ({ member, navLinks }: Props) => {
  const pathname = usePathname();

  return (
    <Card className="w-full items-center h-[80vh]">
      <Image
        height={200}
        width={200}
        src={member.image || "/images/user.png"}
        alt="user profile main image"
        className="rounded-full mt-6 aspect-square object-cover"
      />
      <CardBody>
        <div className="flex flex-col items-center">
          <div className="text-2xl">
            {member.name}, {calculateAge(member.dateOfBirth)}
          </div>
          <div className="text-sm text-neutral-500">
            {member.city}, {member.country}
          </div>
        </div>
        <Divider className="my-3" />
        <nav className="text flex-col p-4 ml-4 text-2xl gap-4">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className={cn("block rounded hover:text-secondary/50", {
                "text-secondary": link.href === pathname,
              })}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </CardBody>
      <CardFooter>
        <Button
          as={Link}
          href="/members"
          color="secondary"
          variant="bordered"
          fullWidth
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberSidebar;
