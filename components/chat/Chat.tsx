"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Chat.module.css";

import { ChatMessage, User } from "@/types";
import { GET_MESSAGES_URL, CHAT_SOCKET_URL } from "@/utils";
import { usePrivy } from "@privy-io/react-auth";

const Chat: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket
  useEffect(() => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    setUser(user);

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
        name: user?.username || "Anonymous",
        imageUrl: user?.pfp || "",
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

  // Update input field
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.chatMessageContainer}>
            <div className={styles.chatMessageInfo}>
              <Image src={msg.imageUrl} alt={msg.name} width={20} height={20} className={styles.chatMessageImage} />
              <p className={styles.chatMessageName}>{msg.name}</p>
            </div>
            <p className={styles.chatMessage}>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatInput}>
        <input type="text" value={inputMessage} onChange={handleMessageChange} placeholder="Type a message..." />
        <button className={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
      <div style={{ width: "100vw", height: "70px", backgroundColor: "#000" }} />
    </div>
  );
};

export default Chat;
