import { title } from "@/components/primitives";
import { auth } from "@/config/auth";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import MessagesBox from "./MessagesBox";
import { getMessagesByContainer } from "@/app/actions/messageActions";
import { MessageExt } from "@/lib/types";

interface Props {
  searchParams: {
    container: string;
  };
}

export default async function MessagesPage({ searchParams }: Props) {
  const session = await auth();
  const user = session?.user as User;
  if (!user) redirect("/auth/login?callbackUrl=/messages");

  console.log(
    "MessagesPage -searchParams",
    searchParams.container ? searchParams.container : "inbox"
  );

  const response = await getMessagesByContainer(
    searchParams.container ? searchParams.container : "inbox"
  );
  const messages = response.data as MessageExt[];
  // console.log(messages);

  return (
    <div className="flex flex-col">
      <MessagesBox messages={messages} />
    </div>
  );
}
