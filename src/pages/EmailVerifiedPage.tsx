import VerificationPage from "../components/Verification/Verification";
import { Navigate, useSearchParams } from "react-router-dom";


const EmailVerifiedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-400/40 dark:bg-purple-600/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/40 dark:bg-blue-600/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <main>
        <VerificationPage token={token} />
      </main>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-4000 {
          animation-delay: -4s;
        }
       `}</style>
    </div>
  );
};

export default EmailVerifiedPage;
