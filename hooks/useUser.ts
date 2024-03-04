import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { getSession } from 'next-auth/react';

import { User } from "@/types";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const { user: privyUser, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    // if (privyUser) {
    //   let image = privyUser.twitter?.profilePictureUrl || "";
    //   image = image.replace("_normal", "");

    //   setUser({
    //     id: privyUser.twitter?.subject || privyUser.id,
    //     image: image,
    //     name: privyUser.twitter?.name || "",
    //     username: privyUser.twitter?.username || "",
    //   });
    // }

    const fetchUserSession = async () => {
      const session = await getSession();
      setUser(session?.user as User);
    };

    fetchUserSession();

  }, [privyUser, ready, router]);

  return user;
}
