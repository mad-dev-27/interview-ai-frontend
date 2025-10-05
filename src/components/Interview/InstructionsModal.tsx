import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, CheckCircle, AlertTriangle, Headphones, Volume, Speaker } from "lucide-react";

const MicSetupModal: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const requestPermission = async () => {
    try {
      // Clean up existing stream and context first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        streamRef.current = stream;
        setPermissionGranted(true);
        setIsTestingMic(true);

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.fftSize);

        const checkLevel = () => {
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
            setHasSpoken(true);
          }

          animationFrameRef.current = requestAnimationFrame(checkLevel);
        };

        checkLevel();
      }
    } catch (err) {
      console.error("Mic permission denied:", err);
      setPermissionGranted(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getBarColor = () => {
    if (micLevel < 20) return "bg-gray-400";
    if (micLevel < 50) return "bg-blue-500";
    if (micLevel < 70) return "bg-green-500";
    return "bg-yellow-500";
  };

  return createPortal(
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Headphones className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Microphone Setup</h2>
          <p className="text-blue-100">Let's ensure your audio is perfect for the interview</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Step 1: Microphone Permission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                permissionGranted ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
              }`}>
                {permissionGranted ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Step 1: Enable Microphone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Grant access to use your microphone</p>
              </div>
              {!permissionGranted && (
                <button
                  onClick={requestPermission}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Enable
                </button>
              )}
            </div>

            {/* Mic Level Indicator */}
            <AnimatePresence>
              {permissionGranted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-13 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {micLevel > 1 ? (
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-5 h-5 text-green-500 animate-pulse" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">Mic Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MicOff className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Speak to test...</span>
                        </div>
                      )}
                    </div>
                    {hasSpoken && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center space-x-1 text-green-600 dark:text-green-400"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Working!</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getBarColor()} transition-all duration-100`}
                        style={{ width: `${Math.min(micLevel, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Quiet</span>
                      <span>Optimal</span>
                      <span>Loud</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Step 2: Environment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <Speaker className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Step 2: Quiet Environment</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Find a quiet space with minimal background noise for best results
              </p>
            </div>
          </motion.div>

          {/* Step 3: Headphones */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Step 3: Use Headphones</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Headphones improve audio quality and prevent echo during recording
              </p>
            </div>
          </motion.div>

          {/* Warning if not spoken */}
          {permissionGranted && !hasSpoken && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Please test your microphone
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Say something like "Hello" or "Testing" to verify it's working
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onContinue}
            disabled={!permissionGranted || !hasSpoken}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
              permissionGranted && hasSpoken
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
            }`}
          >
            {!permissionGranted ? "Enable Microphone to Continue" :
             !hasSpoken ? "Speak to Test Microphone" :
             "Start Interview"}
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={onContinue}
            className="w-full py-3 rounded-xl font-medium text-base transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
          >
            Proceed Without Audio Test
          </motion.button>

          {permissionGranted && hasSpoken && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Your microphone is ready!
            </motion.p>
          )}

          {!permissionGranted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-gray-500 dark:text-gray-400"
            >
              Note: Audio recording may not work without microphone permission
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default MicSetupModal;
