import { useEffect, useState } from "react";
import { DashboardContent } from "../components/Dashboard/DashboardContent";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Header } from "../components/Layout/Header";
import { API_URL } from "../config";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { usePricingStore } from "../store/pricingStore";
import { useUserStore } from "../store/userStore";

const Dashboard: React.FC = () => {
  const setPricing = usePricingStore((state) => state.setPricing);

  const setUserStats = useUserStore((state) => state.setUserStats);

  const setUserActivity = useUserStore((state) => state.setUserActivity);

  const setUserPayment = useUserStore((state) => state.setUserPayment);

  const setMaxWarnings = useUserStore((state) => state.setMaxWarnings);

  const recentActivity = useUserStore((state) => state.userActivity);

  const userStats = useUserStore((state) => state.userStats);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seconds = 30;

    const intervalId = setInterval(() => {
      getStats();
    }, seconds * 1000);

    const getStats = () => {
      axios
        .get(API_URL + "/user/info", {
          headers: { Authorization: "Bearer " + Cookies.get("auth") || "" },
        })
        .then((res) => {
          setPricing(res.data.pricing);
          setUserStats(res.data.userStats);
          setUserPayment(res.data.userPayment);
          setUserActivity(res.data.userActivity);
          setMaxWarnings(res.data.maxWarnings);
          // console.log(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Cannot Fetch Details!!!");
        });
    };
    getStats();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar {...userStats} recentActivity={recentActivity} />
        <DashboardContent loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
