import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zusland/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const fromMe = message.senderId === authUser._id;
  const formatTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilepic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  // console.log(authUser.profilePic, selectedConversation?.profilePic)
  const bubblebgColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src={profilepic}
            alt="Tailwind css chat bubble component"
          />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubblebgColor} ${shakeClass} pb-2`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formatTime}
      </div>
    </div>
  );
};

export default Message;
