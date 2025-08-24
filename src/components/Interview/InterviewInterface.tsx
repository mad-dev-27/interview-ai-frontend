import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";

import {
  AutomaticSpeechRecognitionPipelineType,
  pipeline,
} from "@xenova/transformers"; // ✅ new import

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and your background.",
    category: "General",
    difficulty: "Easy",
  },
  {
    id: 2,
    text: "What are your greatest strengths and how do they apply to this role?",
    category: "Behavioral",
    difficulty: "Medium",
  },
  {
    id: 3,
    text: "Describe a challenging project you've worked on and how you overcame obstacles.",
    category: "Technical",
    difficulty: "Hard",
  },
  {
    id: 4,
    text: "Where do you see yourself in 5 years?",
    category: "General",
    difficulty: "Medium",
  },
  {
    id: 5,
    text: "Why are you interested in this position and our company?",
    category: "Behavioral",
    difficulty: "Easy",
  },
];

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
  const [isRecording, setIsRecording] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [whisper, setWhisper] = useState<AutomaticSpeechRecognitionPipelineType | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  const loadWhisperModel = async () => {
    try {
      setIsLoadingModel(true);
      console.log("🔄 Loading Whisper model...");
      const model = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny"
      );
      setWhisper(model);
      console.log("✅ Whisper model loaded successfully");
    } catch (err) {
      console.error("❌ Failed to load Whisper model:", err);
    } finally {
      setIsLoadingModel(false);
    }
  };

  useEffect(() => {
    loadWhisperModel();
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Date.now() - questionStartTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [questionStartTime]);

  const startRecording = async () => {
    if (!whisper) {
      if (isLoadingModel) {
        alert("Whisper model is still loading. Please wait a moment...");
      } else {
        alert("Whisper model failed to load. Please refresh the page.");
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          const audioBuffer = await audioBlob.arrayBuffer();
          
          console.log("🎤 Transcribing audio...");
          const result = await whisper(audioBuffer);
          console.log("📝 Transcription result:", result.text);
          
          setCurrentResponse((prev) => {
            const newText = prev.trim() ? prev + " " + result.text : result.text;
            return newText;
          });
        } catch (err) {
          console.error("❌ Transcription failed:", err);
          alert("Transcription failed. Please try again.");
        }
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Failed to access microphone:", err);
      alert("Failed to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
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

  const handleNextQuestion = () => {
    if (isRecording) stopRecording();

    const newResponses = [...responses, currentResponse.trim()];
    setResponses(newResponses);
    setCurrentResponse("");

    if (currentQuestionIndex < mockQuestions.length - 1) {
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

  const difficultyColor = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {mockQuestions.length}
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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    difficultyColor[currentQuestion.difficulty]
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQuestion.category}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Response Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Your Response
                </label>
                <div className="flex items-center space-x-2">
                  {isLoadingModel && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Loading model...
                    </span>
                  )}
                  <motion.button
                    onClick={toggleRecording}
                    disabled={isLoadingModel}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      isRecording
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 animate-pulse"
                        : isLoadingModel
                        ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: isLoadingModel ? 1 : 1.05 }}
                    whileTap={{ scale: isLoadingModel ? 1 : 0.95 }}
                    title={
                      isLoadingModel 
                        ? "Loading speech recognition model..." 
                        : isRecording 
                        ? "Stop recording" 
                        : "Start recording"
                    }
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                  </motion.button>
                </div>
              </div>

              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
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
                  <span>Recording... Click the microphone to stop and transcribe</span>
                </motion.div>
              )}
              
              {isLoadingModel && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Loading speech recognition model... This may take a moment on first use.</span>
                </motion.div>
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
                  length: mockQuestions.length - responses.length,
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
                  {currentQuestionIndex === mockQuestions.length - 1
                    ? "Finish Interview"
                    : "Next Question"}
                </span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
