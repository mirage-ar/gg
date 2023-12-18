"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { cookies } from "next/headers";
import { usePrivy } from "@privy-io/react-auth";

import { CREATE_USER_URL } from "@/utils/constants";
import type { User } from "@/types";

function LoginButton() {
  const { login } = usePrivy();
  return <button onClick={login}>Log in</button>;
}

function LogoutButton() {
  const { logout } = usePrivy();
  return <button onClick={logout}>Log out</button>;
}

async function createUser(id: string, username: string, wallet: string): Promise<User> {
  const respone = await fetch(CREATE_USER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { id: id, username: username, wallet: wallet },
    }),
  });

  const result = await respone.json();
  console.log(result);

  const user: User = {
    id,
    username,
    wallet,
    pfp: result.data.pfp,
  };

  return user;
}

const LoginPage: React.FC = () => {
  const { user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const setupUser = async () => {
        if (user.wallet?.address && user.twitter?.username) {
          try {
            const createdUser = await createUser(user.id, user.twitter?.username, user.wallet.address);
            // cookies().set("user-id", user.id);
            document.cookie = `user-id=${user.id}; path=/; max-age=31536000; samesite=strict;`;
            localStorage.setItem("user", JSON.stringify(createdUser));

            router.push("/auth/wallet");
          } catch (error) {
            console.error("Error creating user:", error);
          }
        } else {
          // TODO: log messages to LOGGING service
          console.error("User object not created");
        }
      };

      setupUser();
    }
  }, [router, user]);

  return (
    <main style={{width: "100vh", height: "100vh", backgroundColor: "#000", zIndex: 1000}}>
      <h1>Login</h1>
      <div>{!user && <LoginButton />}</div>
      <div>{user && <LogoutButton />}</div>
    </main>
  );
};

export default LoginPage;
