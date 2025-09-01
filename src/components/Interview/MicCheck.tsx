import { useEffect, useState } from "react";

export const MicChecker: React.FC = () => {
  const [level, setLevel] = useState(0);

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
          rafId = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        console.error("Mic check failed:", err);
      }
    };

    start();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioContext) audioContext.close();
    };
  }, []);

  return (
    <div className="p-4 rounded-xl shadow bg-white w-full sm:w-2/3 md:w-1/3 lg:w-1/4 mt-4">
      <p className="font-semibold text-center mb-2">Mic Level</p>
      <div className="w-full h-4 bg-gray-200 rounded-xl overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-100"
          style={{ width: `${Math.min(level, 100)}%` }}
        />
      </div>
      <p className="text-sm text-center text-gray-600 mt-1">
        {level > 0 ? "🎤 Mic is working" : "🔇 No input"}
      </p>
    </div>
  );
};
