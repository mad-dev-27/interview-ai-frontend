import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      id: "1",
      name: email.split("@")[0],
      email,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg`,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginWithGoogle = async () => {};

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      id: "2",
      name,
      email,
      avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg`,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
