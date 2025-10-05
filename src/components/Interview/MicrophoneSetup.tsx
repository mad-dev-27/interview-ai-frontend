import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, CheckCircle, XCircle, AlertCircle, Headphones } from "lucide-react";
import { Button } from "../ui/Button";

interface MicrophoneSetupProps {
  onComplete: () => void;
}

export const MicrophoneSetup: React.FC<MicrophoneSetupProps> = ({ onComplete }) => {
  const [permissionStatus, setPermissionStatus] = useState<"pending" | "granted" | "denied">("pending");
  const [micLevel, setMicLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;
    let rafId: number;
    let stream: MediaStream | null = null;

    const start = async () => {
      if (permissionStatus !== "granted") return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.fftSize);

        const tick = () => {
          if (!analyser) return;
          analyser.getByteTimeDomainData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const db = 20 * Math.log10(rms + 0.0001);
          const normalizedLevel = Math.max(0, Math.min(100, (db + 60) * 1.67));

          setMicLevel(Math.round(normalizedLevel));
          if (normalizedLevel > 1) {
            setIsActive(true);
            setHasSpoken(true);
          }
          rafId = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        console.error("Mic check failed:", err);
        setIsActive(false);
      }
    };

    start();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) audioContext.close();
    };
  }, [permissionStatus]);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setPermissionStatus("granted");
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error("Mic permission denied:", err);
      setPermissionStatus("denied");
    }
  };

  const getBarColor = () => {
    if (micLevel < 20) return "bg-gray-400";
    if (micLevel < 50) return "bg-blue-500";
    if (micLevel < 70) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <Headphones className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Microphone Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's make sure your microphone is working properly before we begin
          </p>
        </div>

        <div className="space-y-6">
          {permissionStatus === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Microphone Access Required
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We need your permission to access your microphone
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium">What you need to know:</p>
                    <ul className="space-y-1 ml-4 list-disc">
                      <li>Your audio is processed securely and only used for evaluation</li>
                      <li>We analyze your responses to provide detailed feedback</li>
                      <li>No recordings are stored permanently without your consent</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={requestPermission} className="w-full" size="lg">
                <Mic className="w-5 h-5 mr-2" />
                Allow Microphone Access
              </Button>
            </motion.div>
          )}

          {permissionStatus === "granted" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {micLevel > 5 ? (
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse">
                      <Mic className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <MicOff className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      Microphone Test
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hasSpoken ? "Working perfectly!" : "Speak to test your microphone"}
                    </p>
                  </div>
                </div>
                {micLevel > 5 && (
                  <Volume2 className="w-6 h-6 text-green-500 animate-pulse" />
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getBarColor()} transition-all duration-150 ease-out`}
                    style={{ width: `${Math.min(micLevel, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Quiet</span>
                  <span>Moderate</span>
                  <span>Loud</span>
                </div>
              </div>

              {hasSpoken ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Microphone is working perfectly!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You're all set to begin the interview
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-medium mb-1">Test your microphone:</p>
                      <ul className="space-y-1 ml-4 list-disc text-blue-800 dark:text-blue-200">
                        <li>Say "Hello" or "Testing" out loud</li>
                        <li>Watch the level indicator move</li>
                        <li>Adjust your microphone position if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={onComplete}
                disabled={!hasSpoken}
                className="w-full"
                size="lg"
              >
                {hasSpoken ? "Continue to Interview" : "Speak to Continue"}
              </Button>
            </motion.div>
          )}

          {permissionStatus === "denied" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Microphone Access Denied
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We need microphone access to conduct the interview
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  How to enable microphone access:
                </p>
                <ol className="space-y-2 text-sm text-red-800 dark:text-red-200 ml-4 list-decimal">
                  <li>Click the lock or info icon in your browser's address bar</li>
                  <li>Find the microphone permission setting</li>
                  <li>Change it to "Allow" or "Ask"</li>
                  <li>Refresh this page and try again</li>
                </ol>
              </div>

              <Button
                onClick={requestPermission}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
