import { title } from "@/components/primitives";
import { auth } from "@/config/auth";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import MessagesBox from "./MessagesBox";

export default async function PricingPage() {
  const session = await auth();
  const user = session?.user as User;

  if (!user) redirect("/auth/login?callbackUrl=/messages");

  return (
    <div className="flex flex-col">
      <MessagesBox />
    </div>
  );
}
