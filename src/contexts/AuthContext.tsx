import axios, { AxiosError } from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
    try {
      setLoading(true);

      const response = await axios.post(API_URL + "/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      Cookies.set("auth", token, { expires: 7 });

      setLoading(false);
      return true;
    } catch (e: unknown) {
      const err = e as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error);
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {};

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL + "/auth/register", {
        email,
        password,
        name,
      });

      console.log(response);

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
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
