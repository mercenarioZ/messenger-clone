"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      setMessages(current => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      })
    };

    pusherClient.bind("new-message", messageHandler);

    // Unsubscribe from channel when component unmounts
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("new-message", messageHandler);
    }
  }, [conversationId]);

  return (
    <div className="p-2 flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          key={message.id}
          isLastMessage={index === messages.length - 1}
          data={message}
        />
      ))}

      <div
        ref={bottomRef}
        className="pt-24"
      />
    </div>
  );
};

export default Body;
