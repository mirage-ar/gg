"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as DateFNS from "date-fns";
import styles from "./MapChat.module.css";

import { ChatMessage } from "@/types";
import { GET_MESSAGES_URL, CHAT_SOCKET_URL } from "@/utils/constants";
import { useUser } from "@/hooks";

const MapChat: React.FC = () => {
  const user = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showChat, setShowChat] = useState<boolean>(true);

  useEffect(() => {
    setShowChat(true);
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    fetchInitialMessages();

    webSocket.current = new WebSocket(CHAT_SOCKET_URL);

    webSocket.current.onmessage = (event: MessageEvent) => {
      const message: ChatMessage = JSON.parse(event.data);

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages.slice(-20);
      });
    };

    webSocket.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  // TODO: add name and image url
  // TODO: add own messages to state and hide send button until message is sent
  const sendMessage = () => {
    if (inputMessage !== "" && webSocket.current) {
      const messageData: ChatMessage = {
        message: inputMessage,
        timestamp: Date.now(),
        username: user?.username || "Anonymous",
        image: user?.image || "",
      };
      webSocket.current.send(JSON.stringify({ action: "sendmessage", data: messageData }));
      setInputMessage("");
    }
  };

  // Fetch initial messages
  const fetchInitialMessages = async () => {
    try {
      const response = await fetch(GET_MESSAGES_URL);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setMessages(data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch initial messages:", error);
    }
  };

  return (
    <div
      className={styles.chatContainer}
      onClick={() => setShowChat(false)}
      style={{ display: showChat ? "block" : "none" }}
    >
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index} className={styles.chatMessageContainer}>
            <div className={styles.chatMessageInfo}>
              <Image
                src={message.image}
                alt={message.username}
                width={20}
                height={20}
                className={styles.chatMessageImage}
              />
              <p className={styles.chatMessageName}>{message.username}</p>
              <p className={styles.chatMessageTimestamp}>
                {DateFNS.formatDistance(new Date(message.timestamp), new Date(), { addSuffix: true })}
              </p>
            </div>
            <p className={styles.chatMessage}>{message.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MapChat;
