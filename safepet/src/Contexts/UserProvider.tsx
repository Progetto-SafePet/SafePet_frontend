import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type UserContextType = {
  usernameGlobal: string;
  updateUsername: (newUsername: string) => void;
};

const UserContext = createContext<UserContextType>({
  usernameGlobal: '',
  updateUsername: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [usernameGlobal, setUsernameGlobal] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('authToken');
    if (savedUsername) {
      setUsernameGlobal(savedUsername);
    }
  }, []);

  const updateUsername = (newUsername: string) => {
    setUsernameGlobal(newUsername);
    localStorage.setItem('authToken', newUsername);
  };

  return (
    <UserContext.Provider value={{ usernameGlobal, updateUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
