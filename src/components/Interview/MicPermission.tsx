import { useState } from "react";

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
    <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 w-fit border border-gray-200 dark:border-gray-700">
      <p className="mb-2 font-semibold text-gray-900 dark:text-white">Microphone Permission</p>
      {status === "pending" && (
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Allow Microphone
        </button>
      )}
      {status === "granted" && (
        <p className="text-green-600 dark:text-green-400">✅ Permission granted</p>
      )}
      {status === "denied" && (
        <p className="text-red-600 dark:text-red-400">❌ Permission denied</p>
      )}
    </div>
  );
};
