import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import { User } from "@/types";

export default function useUser() {
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const fetchUserSession = async () => {
  //     const session = await getSession();
  //     setUser(session?.user as User);
  //   };

  //   fetchUserSession();
  // }, []);

  const user = {
    id: "123",
    username: "fiigmnt",
    image: "https://pbs.twimg.com/profile_images/1564446865927593984/2dKVOZk7_400x400.jpg",
    wallet: "8EDurUnRAKw5MEDiJtVeYBZS7h7kEVzvYwZpgUeuZAMd",
  };

  return user;
}
