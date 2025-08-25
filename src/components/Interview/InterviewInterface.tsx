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

// Mock follow-up questions based on responses
const generateFollowUpQuestion = (response: string, originalQuestion: string): string | null => {
  const responseWords = response.toLowerCase();
  
  if (originalQuestion.includes("Tell me about yourself")) {
    if (responseWords.includes("project") || responseWords.includes("experience")) {
      return "Can you elaborate on one specific project that you're most proud of?";
    }
    if (responseWords.includes("team") || responseWords.includes("leadership")) {
      return "Tell me about a time when you had to lead a team through a difficult situation.";
    }
  }
  
  if (originalQuestion.includes("strengths")) {
    if (responseWords.includes("problem") || responseWords.includes("solving")) {
      return "Can you give me a specific example of a complex problem you solved?";
    }
    if (responseWords.includes("communication") || responseWords.includes("collaborate")) {
      return "Describe a situation where your communication skills made a significant difference.";
    }
  }
  
  if (originalQuestion.includes("challenging project")) {
    if (responseWords.includes("team") || responseWords.includes("conflict")) {
      return "How did you handle any conflicts or disagreements within the team during this project?";
    }
    if (responseWords.includes("deadline") || responseWords.includes("time")) {
      return "How do you typically manage tight deadlines and competing priorities?";
    }
  }
  
  return null;
};
interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isFollowUp?: boolean;
  parentQuestionId?: number;
}

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
  const [allQuestions, setAllQuestions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<AudioChunk[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunkStartTimeRef = useRef<number>(0);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Date.now() - questionStartTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [questionStartTime]);

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

  // Process and send audio chunk
  const processAudioChunk = async () => {
    if (chunksRef.current.length > 0) {
      const chunkBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const chunkDuration = Date.now() - chunkStartTimeRef.current;

      // Store chunk for playback (dev feature)
      const audioChunk: AudioChunk = {
        blob: chunkBlob,
        timestamp: chunkStartTimeRef.current,
        duration: chunkDuration,
      };

      setRecordedChunks((prev) => [...prev, audioChunk]);

      // Send to backend for transcription
      await transcribeAudioChunk(chunkBlob);

      // Reset for next chunk
      chunksRef.current = [];
      chunkStartTimeRef.current = Date.now();
    }
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

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Set up 11-second chunk processing
      const processChunks = () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.requestData();
          processAudioChunk();

          // Schedule next chunk processing
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
      setTimeout(async () => {
        await processAudioChunk();
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
    
    // Check if we should generate a follow-up question
    const followUpQuestion = generateFollowUpQuestion(currentResponse.trim(), currentQuestion.text);
    
    if (followUpQuestion && !currentQuestion.isFollowUp && Math.random() > 0.5) { // 50% chance for follow-up
      const followUp: Question = {
        id: Date.now(),
        text: followUpQuestion,
        category: "Follow-up",
        difficulty: "Medium",
        isFollowUp: true,
        parentQuestionId: currentQuestion.id
      };
      
      // Insert follow-up question after current question
      const newQuestions = [...allQuestions];
      newQuestions.splice(currentQuestionIndex + 1, 0, followUp);
      setAllQuestions(newQuestions);
      setShowFollowUp(true);
      
      setTimeout(() => setShowFollowUp(false), 3000);
    }
    
    setCurrentResponse("");
    setRecordedChunks([]); // Clear recorded chunks for next question

    if (currentQuestionIndex < allQuestions.length - 1) {
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
              Question {currentQuestionIndex + 1} of {allQuestions.length}
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
              {showFollowUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200"
                >
                  💡 Follow-up question generated based on your response!
                </motion.div>
              )}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    difficultyColor[currentQuestion.difficulty]
                  }`}
                >
                  {currentQuestion.difficulty}
                  {currentQuestion.isFollowUp && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400">• Follow-up</span>
                  )}
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
                        isPlayingAudio ? "Stop playback" : "Play recorded audio"
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
                  <span>
                    Recording in 11-second chunks... Transcription happens
                    automatically
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
                  {currentQuestionIndex === allQuestions.length - 1
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
