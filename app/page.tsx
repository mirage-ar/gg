"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  // const { user } = usePrivy();
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/auth/login");
  //   }
  // });

  return (
    <main>
      <h1>Home</h1>
    </main>
  );
};

export default Home;
