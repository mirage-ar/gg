import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

import { User } from "@/types";

export default function useUser() {
  const [ user, setUser ] = useState<User | null>(null);
  const { user: privyUser } = usePrivy();

  useEffect(() => {
    if (privyUser) {
      setUser({
        id: privyUser.twitter?.subject || privyUser.id,
        image: privyUser.twitter?.profilePictureUrl || "",
        name: privyUser.twitter?.name || "",
        username: privyUser.twitter?.username || "",
      });
    }

  }, [privyUser]);

  return user;
}
