import { MessageExt } from "@/lib/types";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

interface Props {
  message: MessageExt;
}

const NewMessageToast = ({ message }: Props) => {
  return (
    <Link
      className="flex items-center"
      href={`/members/${message.sender.userId}/chat`}
    >
      <div className="mr-2">
        <Image
          alt="sender image"
          height={50}
          src={message.sender.image || "/images/blank-profile.png"}
          width={50}
        />
      </div>
      <div className="flex flex-grow flex-col justify-center">
        <div className="font-semibold">
          {message.sender.name} sent you a message
        </div>
        <div className="text-sm">Click to View</div>
      </div>
    </Link>
  );
};

export default NewMessageToast;

// export const newMessageToast = (message: MessageExt) =>
//   toast(<NewMessageToast message={message} />);
