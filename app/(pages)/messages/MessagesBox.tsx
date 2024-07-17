import React from "react";
import MessagesSidebar from "./MessagesSidebar";
import { MessageExt } from "@/lib/types";
import _ from "lodash";
import MessageTable from "./MessageTable";

interface Props {
  messages: MessageExt[];
}

const MessagesBox = ({ messages }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-5 h-full mt-10">
      <div className="col-span-2">
        <MessagesSidebar />
      </div>
      <div className="col-span-10">
        <MessageTable messages={messages} />
      </div>
    </div>
  );
};

export default MessagesBox;
