import { useState } from "react";
import { Mic, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

export const MicPermission: React.FC = () => {
  const [status, setStatus] = useState<"pending" | "granted" | "denied">(
    "pending"
  );

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setStatus("granted");
        stream.getTracks().forEach((track) => track.stop()); // stop right after check
      }
    } catch (err) {
      console.error("Mic permission denied:", err);
      setStatus("denied");
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 w-full border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Microphone Access</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Required for interview
          </p>
        </div>
      </div>

      {status === "pending" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We need permission to access your microphone to conduct the interview. Your audio is processed securely and only used for evaluation.
              </p>
            </div>
          </div>
          <Button
            onClick={requestPermission}
            className="w-full"
          >
            Allow Microphone Access
          </Button>
        </div>
      )}

      {status === "granted" && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Permission granted successfully!
            </p>
          </div>
        </div>
      )}

      {status === "denied" && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Microphone access denied
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                Please enable microphone access in your browser settings to continue with the interview.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
