import { title } from "@/components/primitives";
import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import _ from "lodash";
import MemberCard from "./MemberCard";

export default async function MembersPage() {
  const session = await auth();
  const user = session?.user as User;
  if (!user) redirect("/auth/login");

  const members = await prisma.member.findMany({
    where: {
      NOT: {
        userId: user.id,
      },
    },
  });

  if (_.isEmpty(members))
    return (
      <h1 className="text-xl px-10 py-5 font-semibold border border-red-500 rounded-md">
        Members Not Found
      </h1>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-fit">
      {members.map((member) => (
        <MemberCard member={member} key={member.id} />
      ))}
    </div>
  );
}
