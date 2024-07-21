import { auth } from "@/config/auth";
import ChatForm from "./ChatForm";
import { CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import _ from "lodash";
import { MessageExt } from "@/lib/types";
import ChatCards from "./ChatCards";
import { getChatMessages } from "@/app/actions/messageActions";
import { createChatID } from "@/lib/utils";

interface Props {
  params: {
    id: string;
  };
}

const ChatPage = async ({ params }: Props) => {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/auth/login");
  const chatID = createChatID(user.id, params.id);

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
            <ChatCards
              currentUser={user}
              initMessages={messages}
              chatID={chatID}
            />
          </>
        )}
      </CardBody>
      <CardFooter className="pt-5 mt-5">
        <ChatForm />
      </CardFooter>
    </>
  );
};

export default ChatPage;
