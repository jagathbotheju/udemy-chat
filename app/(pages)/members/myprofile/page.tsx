import React from "react";
import MemberProfile from "../[id]/MemberProfile";
import { auth } from "@/config/auth";
import { Member, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const MyProfilePage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user) redirect("/auth/login");

  const member = (await prisma.member.findUnique({
    where: {
      userId: user.id,
    },
  })) as Member;

  return <MemberProfile member={member} currentUser={user} />;
};

export default MyProfilePage;
