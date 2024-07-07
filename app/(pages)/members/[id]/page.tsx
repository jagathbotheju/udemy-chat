import prisma from "@/lib/prisma";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import MemberProfile from "./MemberProfile";
import { auth } from "@/config/auth";
import { User } from "@prisma/client";

interface Props {
  params: {
    id: string;
  };
}

const MemberDetailPage = async ({ params }: Props) => {
  const session = await auth();
  const user = session?.user as User;
  const member = await prisma.member.findUnique({
    where: {
      userId: params.id,
    },
  });

  if (!member)
    return (
      <h1 className="text-xl font-semibold py-5 px-10 border border-red-600 rounded-md">
        Member Details not Found
      </h1>
    );

  return <MemberProfile member={member} currentUser={user} />;
};

export default MemberDetailPage;
