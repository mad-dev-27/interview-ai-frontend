import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Clock,
  ArrowRight,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useQuestionStore } from "../../store/interviewStore";
import { toast } from "sonner";

interface AudioChunk {
  blob: Blob;
  timestamp: number;
  duration: number;
}

interface InterviewInterfaceProps {
  onComplete: (responses: string[]) => void;
  jobDescription: string;
  resume: File | null;
}

export const InterviewInterface: React.FC<InterviewInterfaceProps> = ({
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isRecording, setIsRecording] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<AudioChunk[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [setupFullScreen, setSetupFullScreen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunkStartTimeRef = useRef<number>(0);

  const { questions } = useQuestionStore();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = 20 * 60 * 1000 - (Date.now() - questionStartTime); // 20 mins
      const safeRemaining = Math.max(remaining, 0);
      setTimeSpent(safeRemaining);

      if (safeRemaining === 0) {
        clearInterval(timer);
        toast.info("⏰ Time's up! Moving to the Result Page.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [questionStartTime]);

  useEffect(() => {
    // 🚨 Detect tab switch / window blur
    const handleBlur = () => {
      toast.error("🚨 You left the exam window!");
    };

    // 🚨 Detect mouse leaving the exam window
    const handleMouseLeave = () => {
      toast.error("🚨 Cursor left the exam screen!");
    };

    // 🚨 Detect exiting fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        toast.error("🚨 You exited fullscreen!");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const enableSafeMode = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
      setSetupFullScreen(true);
    }
  };

  // Send audio chunk to backend for transcription
  const transcribeAudioChunk = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      console.log("🎤 Sending audio chunk for transcription...");

      const formData = new FormData();
      formData.append("audio", audioBlob, `audio_chunk_${Date.now()}.webm`);

      // Replace this URL with your backend endpoint
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📝 Transcription result:", result.text);

      if (result.text && result.text.trim()) {
        setCurrentResponse((prev) => {
          const newText = prev.trim()
            ? prev + " " + result.text.trim()
            : result.text.trim();
          return newText;
        });
      }
    } catch (err) {
      console.error("❌ Transcription failed:", err);
      // Don't show alert for every failed chunk, just log the error
    } finally {
      setIsTranscribing(false);
    }
  };

  const processAudioChunk = async (blob: Blob) => {
    const chunkDuration = Date.now() - chunkStartTimeRef.current;

    // Debugging: log blob URL
    const debugUrl = URL.createObjectURL(blob);
    console.log("🎧 New audio chunk blob:", debugUrl);

    // Store chunk for playback (dev feature)
    const audioChunk: AudioChunk = {
      blob,
      timestamp: chunkStartTimeRef.current,
      duration: chunkDuration,
    };
    setRecordedChunks((prev) => [...prev, audioChunk]);

    // ✅ Send to backend for transcription
    await transcribeAudioChunk(blob);

    // Reset for next chunk
    chunkStartTimeRef.current = Date.now();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      chunkStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          await processAudioChunk(e.data); // pass blob directly
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Timer just flushes the buffer every 11s
      const processChunks = () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.requestData(); // triggers ondataavailable → processAudioChunk
          chunkTimerRef.current = setTimeout(processChunks, 11000);
        }
      };

      // Start first chunk timer
      chunkTimerRef.current = setTimeout(processChunks, 11000);
    } catch (err) {
      console.error("❌ Failed to access microphone:", err);
      alert("Failed to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      // Clear the chunk timer
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }

      // Request final data and stop recording
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();

      // Process the final chunk
      setTimeout(async (blob: Blob) => {
        await processAudioChunk(blob);
      }, 100);
    }

    // Clean up the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Dev feature: Play recorded audio
  const playRecordedAudio = () => {
    if (recordedChunks.length === 0) return;

    if (isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }

    // Combine all chunks into one blob for playback
    const allChunks = recordedChunks.map((chunk) => chunk.blob);
    const combinedBlob = new Blob(allChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(combinedBlob);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlayingAudio(true);

      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const handleNextQuestion = () => {
    if (isRecording) stopRecording();

    const newResponses = [...responses, currentResponse.trim()];
    setResponses(newResponses);

    setCurrentResponse("");
    setRecordedChunks([]); // Clear recorded chunks for next question

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      onComplete(newResponses);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {!setupFullScreen ? (
        <div className="flex justify-center items-center h-screen">
          <Button
            onClick={enableSafeMode}
            className="px-6 dark:bg-black py-3 text-lg font-semibold"
          >
            Start Interview
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hidden audio element for playback */}
          <audio ref={audioRef} style={{ display: "none" }} />

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock size={16} />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium  bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                  >
                    {"Easy"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {"Technical"}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Response Area */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Your Response
                  </label>
                  <div className="flex items-center space-x-2">
                    {/* Dev: Play recorded audio button */}
                    {recordedChunks.length > 0 && (
                      <motion.button
                        onClick={playRecordedAudio}
                        className={`p-2 rounded-full text-xs transition-all duration-200 ${
                          isPlayingAudio
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={
                          isPlayingAudio
                            ? "Stop playback"
                            : "Play recorded audio"
                        }
                      >
                        {isPlayingAudio ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </motion.button>
                    )}

                    {isTranscribing && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Transcribing...
                      </span>
                    )}

                    <motion.button
                      onClick={toggleRecording}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isRecording
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 animate-pulse"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={isRecording ? "Stop recording" : "Start recording"}
                    >
                      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    </motion.button>
                  </div>
                </div>

                <textarea
                  value={currentResponse}
                  onClick={() => {
                    if (isRecording) {
                      toast.info("⏸️ Pause recording to type your response.");
                    }
                  }}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  readOnly={isRecording}
                  placeholder="Speak or type your response..."
                  className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>
                      Recording ... Transcription happens automatically
                    </span>
                  </motion.div>
                )}

                {isTranscribing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span>Processing audio chunk for transcription...</span>
                  </motion.div>
                )}

                {recordedChunks.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Recorded {recordedChunks.length} audio chunk
                    {recordedChunks.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  {responses.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={12} className="text-white" />
                    </motion.div>
                  ))}
                  {Array.from({
                    length: questions.length - responses.length,
                  }).map((_, index) => (
                    <div
                      key={index + responses.length}
                      className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!currentResponse.trim()}
                  className="flex items-center space-x-2"
                >
                  <span>
                    {currentQuestionIndex === questions.length - 1
                      ? "Finish Interview"
                      : "Next Question"}
                  </span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
