import { ArrowRight, CheckCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const VerificationPage = ({ token }: { token: string }) => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      const decoded = jwtDecode(token) as { name: string };
      localStorage.setItem("name", decoded.name);
      Cookies.set("auth", token, { expires: 7 });
      navigate("/dashboard");
      return;
    }

    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [countdown, navigate, token]);

  const handleGoToDashboard = () => {
    setCountdown(0);
    const decoded = jwtDecode(token) as { name: string };
    localStorage.setItem("name", decoded.name);
    Cookies.set("auth", token, { expires: 7 });
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-24">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg p-8 sm:p-12 rounded-3xl shadow-2xl shadow-gray-500/10 dark:shadow-black/20 max-w-2xl w-full border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full border-4 border-green-200 dark:border-green-500/30">
            <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Email Verified Successfully!
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Welcome aboard! Your account is now active. You will be automatically
          redirected to your dashboard.
        </p>

        <div className="my-10">
          {countdown > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Redirecting in</p>
              <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {countdown}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse">
                Redirecting now...
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGoToDashboard}
            className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
          >
            Go to Dashboard Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
