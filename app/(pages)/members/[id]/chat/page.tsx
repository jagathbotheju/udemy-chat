import { auth } from "@/config/auth";
import ChatForm from "./ChatForm";
import { CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import _ from "lodash";
import { MessageExt } from "@/lib/types";
import ChatCards from "./ChatCards";
import { getChatMessages } from "@/app/actions/messageActions";

interface Props {
  params: {
    id: string;
  };
}

const ChatPage = async ({ params }: Props) => {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/auth/login");

  const response = await getChatMessages(params.id);
  const messages = response.data as MessageExt[];

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Chats
      </CardHeader>
      <Divider />
      <CardBody>
        {_.isEmpty(messages) ? (
          <>
            <h2 className="font-semibold text-3xl">No Chats Found!</h2>
          </>
        ) : (
          <>
            <ChatCards messages={messages} currentUser={user} />
          </>
        )}
      </CardBody>
      <CardFooter>
        <ChatForm />
      </CardFooter>
    </>
  );
};

export default ChatPage;
