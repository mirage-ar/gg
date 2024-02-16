import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

import { User } from '@/types';

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const session = await getSession();
      setUser(session?.user as User);
    };

    fetchUserSession();
  }, []);

  return user;
}
