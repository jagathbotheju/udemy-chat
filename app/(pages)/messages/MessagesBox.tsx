import React from "react";
import MessagesSidebar from "./MessagesSidebar";

const MessagesBox = () => {
  return (
    <div className="grid grid-cols-12 gap-5 h-full mt-10">
      <div className="col-span-2">
        <MessagesSidebar />
      </div>
      <div className="col-span-10">Message tab</div>
    </div>
  );
};

export default MessagesBox;
