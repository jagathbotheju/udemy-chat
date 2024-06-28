import { CardBody, CardHeader, Divider } from "@nextui-org/react";

const ChatPage = () => {
  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Chats
      </CardHeader>
      <Divider />
      <CardBody>Chat Data</CardBody>
    </>
  );
};

export default ChatPage;
