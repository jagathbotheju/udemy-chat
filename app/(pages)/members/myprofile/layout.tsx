import prisma from "@/lib/prisma";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@nextui-org/card";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const basePath = `/members/myprofile`;
  const navLinks = [
    { name: "Profile", href: `${basePath}` },
    { name: "Photos", href: `${basePath}/photos` },
  ];
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/auth/login");

  const member = await prisma.member.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!member)
    return (
      <h1 className="text-xl font-semibold py-5 px-10 border border-red-600 rounded-md">
        Member Details not Found
      </h1>
    );

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks} />
      </div>

      <div className="col-span-9">
        <Card className="w-full h-[80vh]">{children}</Card>
      </div>
    </div>
  );
};

export default Layout;
