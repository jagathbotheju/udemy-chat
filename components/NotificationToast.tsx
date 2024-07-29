import Link from "next/link";
import React from "react";
import { Image } from "@nextui-org/react";
import { MessageExt } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  image?: string | null;
  href: string;
  title: string;
  subTitle?: string;
}

const NotificationToast = ({ image, href, title, subTitle }: Props) => {
  return (
    <Link className="flex items-center" href={href}>
      <div className="mr-2">
        <Image
          alt="sender image"
          height={50}
          src={image || "/images/blank-profile.png"}
          width={50}
        />
      </div>
      <div className="flex flex-grow flex-col justify-center">
        <div className="justify-center font-semibold">{title}</div>
        <div className="text-sm">{subTitle || "Click to View"}</div>
      </div>
    </Link>
  );
};

export default NotificationToast;

export const newMessageToast = (message: MessageExt) =>
  toast(
    <NotificationToast
      href={`/members/${message.sender.userId}`}
      image={message.sender.image}
      title={`${message.sender.name} has sent your a new message`}
    />
  );

export const newLikeToast = (
  name: string,
  image: string | null,
  userId: string
) =>
  toast(
    <NotificationToast
      href={`/members/${userId}`}
      image={image}
      subTitle="Click here to view the profile"
      title={`You have been liked by ${name}`}
    />
  );
