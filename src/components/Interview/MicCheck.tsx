import { useEffect, useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

export const MicChecker: React.FC = () => {
  const [level, setLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;
    let rafId: number;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          let values = 0;
          for (let i = 0; i < dataArray.length; i++) {
            values += dataArray[i];
          }
          const average = values / dataArray.length;
          setLevel(Math.round(average));
          if (average > 0) {
            setIsActive(true);
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
      if (audioContext) audioContext.close();
    };
  }, []);

  const getBarColor = () => {
    if (level < 20) return "bg-gray-400";
    if (level < 50) return "bg-blue-500";
    if (level < 70) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 w-full border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {level > 5 ? (
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse">
              <Mic className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <MicOff className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Microphone Level</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {level > 5 ? "Active" : "Waiting for input"}
            </p>
          </div>
        </div>
        {level > 5 && (
          <Volume2 className="w-5 h-5 text-green-500 animate-pulse" />
        )}
      </div>

      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor()} transition-all duration-150 ease-out`}
            style={{ width: `${Math.min(level, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Quiet</span>
          <span>Loud</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          {isActive
            ? "Great! Your microphone is working properly."
            : "Speak to test your microphone. Make sure it's connected and permissions are granted."}
        </p>
      </div>
    </div>
  );
};
