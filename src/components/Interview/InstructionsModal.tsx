import React, { useState } from "react";
import { createPortal } from "react-dom";

const MicSetupModal: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setPermissionGranted(true);
        stream.getTracks().forEach(track => track.stop()); // stop after check
      }
    } catch (err) {
      console.error("Mic permission denied:", err);
      setPermissionGranted(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Microphone Setup</h2>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Step 1</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Enable microphone</p>
            </div>
            <button
              onClick={requestPermission}
              className={`px-4 py-2 rounded-lg ${
                permissionGranted
                  ? "bg-green-500 text-white dark:bg-green-600"
                  : "bg-blue-500 text-white dark:bg-blue-600"
              }`}
            >
              {permissionGranted ? "✅ Granted" : "Enable"}
            </button>
          </div>

          {/* Step 2 */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Step 2</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Avoid noisy environments</p>
          </div>

          {/* Step 3 */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Step 3</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Use headphones for better transcription quality
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          disabled={!permissionGranted}
          className={`mt-6 w-full py-2 rounded-xl font-semibold ${
            permissionGranted
              ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
          }`}
        >
          Continue
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MicSetupModal;
