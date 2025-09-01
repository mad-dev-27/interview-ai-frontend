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
    <div className="p-4 rounded-xl shadow bg-white w-fit">
      <p className="mb-2 font-semibold">Microphone Permission</p>
      {status === "pending" && (
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl"
        >
          Allow Microphone
        </button>
      )}
      {status === "granted" && (
        <p className="text-green-600">✅ Permission granted</p>
      )}
      {status === "denied" && (
        <p className="text-red-600">❌ Permission denied</p>
      )}
    </div>
  );
};
