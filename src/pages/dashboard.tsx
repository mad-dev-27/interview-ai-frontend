import { useEffect, useState } from "react";
import { DashboardContent } from "../components/Dashboard/DashboardContent";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Header } from "../components/Layout/Header";
import { API_URL } from "../config";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface recentActivity {
  name: string;
  id: string;
  endTime: string;
  isComplete: boolean;
  isPreInterviewDone: boolean;
  startTime: string;
  status: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [sideBarData, setSideBarData] = useState({
    interviewLeft: 0,
    completedInterview: 0,
    totalInterview: 0,
  });

  const [recentActivity, setRecentActivity] = useState<recentActivity[]>([]);

  useEffect(() => {
    const seconds = 10;

    setInterval(() => {
      getStats();
    }, seconds * 1000);
    const getStats = () => {
      axios
        .get(API_URL + "/user/stats", {
          headers: { Authorization: "Bearer " + Cookies.get("auth") || "" },
        })
        .then((res) => {
          setSideBarData(res.data);
        })
        .catch(() => {
          toast.error("Cannot Fetch Details!!!");
        });

      axios
        .get(API_URL + "/user/activity", {
          headers: { Authorization: "Bearer " + Cookies.get("auth") || "" },
        })
        .then((res) => {
          setRecentActivity(res.data.sessions);
        })
        .catch(() => {
          toast.error("Cannot Fetch Details!!!");
        });
    };
    getStats();
  }, []);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar {...sideBarData} recentActivity={recentActivity} />
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
