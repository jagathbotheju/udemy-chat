import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { Member, Photo, User } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import MyPhotos from "./MyPhotos";

const MyPhotosPage = async () => {
  const session = await auth();
  const authUser = session?.user as User;

  if (!authUser) redirect("/auth/login");

  const member = (await prisma.member.findUnique({
    where: {
      userId: authUser.id,
    },
    include: {
      photos: true,
    },
  })) as Member & {
    photos: Photo[];
  };

  return <MyPhotos authUser={authUser} member={member} />;
};

export default MyPhotosPage;
