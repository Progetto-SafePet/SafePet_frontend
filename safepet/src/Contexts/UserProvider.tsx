import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type UserContextType = {
  usernameGlobal: string;
  role: string;
  updateUser: (username: string, role: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  usernameGlobal: '',
  role: '',
  updateUser: () => {},
  logout: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [usernameGlobal, setUsernameGlobal] = useState('');
  const [role, setRole] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const savedUsername = localStorage.getItem('authUsername');
    const savedRole = localStorage.getItem('authRole');

    if (savedUsername) setUsernameGlobal(savedUsername);
    if (savedRole) setRole(savedRole);

    setIsLoaded(true); 
  }, []);

  const updateUser = (username: string, role: string) => {
    setUsernameGlobal(username);
    setRole(role);
    localStorage.setItem('authUsername', username);
    localStorage.setItem('authRole', role);
  };

  const logout = () => {
    setUsernameGlobal('');
    setRole('');
    localStorage.removeItem('authUsername');
    localStorage.removeItem('authRole');
  };

  if (!isLoaded) return null;

  return (
    <UserContext.Provider value={{ usernameGlobal, role, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
