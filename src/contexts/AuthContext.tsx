import axios, { AxiosError } from "axios";
import React, { createContext, useContext, useState } from "react";
import { API_URL } from "../config";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
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
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const token = Cookies.get("auth");
  //   axios
  //     .get(API_URL + "/auth/checkUser", {
  //       headers: { Authorization: "Bearer " + token },
  //     })
  //     .then(() => {
  //       toast.success("You’re already logged in 👍");
  //     })
  //     .catch(() => {
  //       toast.error("🔒 Session timed out. Log in to continue.");
  //     });
  //   setLoading(false);
  // }, []);

  const resendEmail = async (email: string) => {
    try {
      await axios.post(API_URL + "/auth/otp", {
        email,
      });
      toast.success(
        "📩 New link is on the way — don’t forget to check spam too!"
      );
    } catch {
      toast.error("🚧 Oops! We couldn’t send your email right now.");
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      setLoading(true);

      const response = await axios.post(API_URL + "/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const decoded = jwtDecode(token) as { name: string };
      localStorage.setItem("name", decoded.name);
      Cookies.set("auth", token, { expires: 7 });

      setLoading(false);
      return true;
    } catch (e: unknown) {
      const err = e as AxiosError<{ error: string }>;

      if (err.response?.data?.error === "Error: Email Not Verified") {
        toast.warning("🚧 Hold up — your email’s still unverified.", {
          action: {
            label: "📩 Resend Link",
            onClick: () => resendEmail(email),
          },
        });
        setLoading(false);
        return false;
      }

      toast.error(err.response?.data?.error);
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {};

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);

    try {
      setLoading(true);
      await axios.post(API_URL + "/auth/register", {
        email,
        password,
        name,
      });
      toast.info("🎉 You’re in! Just verify your email to keep going.");
      setLoading(false);
    } catch (e) {
      const err = e as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error);
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("auth");
    localStorage.removeItem("name");
    // window.location.reload();
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider
      value={{
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
