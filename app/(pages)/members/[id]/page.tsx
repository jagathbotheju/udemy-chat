import prisma from "@/lib/prisma";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";

interface Props {
  params: {
    id: string;
  };
}

const MemberDetailPage = async ({ params }: Props) => {
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

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Profile
      </CardHeader>
      <Divider />
      <CardBody>{member.description}</CardBody>
    </>
  );
};

export default MemberDetailPage;
