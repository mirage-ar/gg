"use client";

import React from "react";
import Chat from "@/components/chat/Chat";
import PageHeader from "@/components/navigation/PageHeader";

import styles from "./page.module.css"

const ChatPage: React.FC = () => {
  return (
    <main className={styles.container}>
      <PageHeader />
      <Chat />
    </main>
  );
}

export default ChatPage;
