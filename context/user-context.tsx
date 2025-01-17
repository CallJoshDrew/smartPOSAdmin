'use client';

import { createContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

type UserData = {
  id: string;
  name: string;
  role: string;
  image?: string;
};

type UserContextType = {
  users: UserData[];
  setUsers: (users: UserData[]) => void;
};

const defaultUserData: UserData[] = [];

export const UserContext = createContext<UserContextType>({
  users: defaultUserData,
  setUsers: () => {},
});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [users, setUsers] = useState<UserData[]>(defaultUserData);

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
}
