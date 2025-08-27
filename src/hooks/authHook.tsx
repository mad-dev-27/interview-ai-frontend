
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config";

export const useCheckAuth = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("auth");
        if (!token) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        const res = await axios.get(API_URL + "/auth/checkUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
        setLoading(false);
      } catch {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return { authenticated, loading };
};
