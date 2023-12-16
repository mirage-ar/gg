"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

function LogoutButton() {
  const { logout } = usePrivy();
  return <button onClick={logout}>Log Out</button>;
}

function LoginButton() {
    const { login } = usePrivy();
    return <button onClick={login}>Log In</button>;
  }

const ChatPage: React.FC = () => {
  const { user } = usePrivy();
  useEffect(() => {
    console.log("chat page");
  });
  return (
    <main>
      <h1>Chat</h1>
      {!user && <LoginButton />}
      {user && <LogoutButton />}
    </main>
  );
}

export default ChatPage;
