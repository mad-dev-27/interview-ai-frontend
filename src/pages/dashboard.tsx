import { DashboardContent } from "../components/Dashboard/DashboardContent";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Header } from "../components/Layout/Header";

const Dashboard: React.FC = () => {
  const sidebarData = {
    recentInterviews: 3,
    freeInterviewsLeft: 1,
    totalInterviews: 5,
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar {...sidebarData} />
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
