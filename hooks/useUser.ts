import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { User } from "@/types";

export default function useUser() {
  const [ user, setUser ] = useState<User | null>(null);
  const { user: privyUser } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (privyUser) {
      let image = privyUser.twitter?.profilePictureUrl || "";
      image = image.replace("_normal", "");

      setUser({
        id: privyUser.twitter?.subject || privyUser.id,
        image: image,
        name: privyUser.twitter?.name || "",
        username: privyUser.twitter?.username || "",
      });
    } else {
      router.push("/api/auth/login");
    }

  }, [privyUser, router]);

  return user;
}
