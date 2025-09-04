import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Clock, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useQuestionStore } from "../../store/interviewStore";
import { toast } from "sonner";
import { API_URL } from "../../config";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import MicSetupModal from "./InstructionsModal";
import { MicChecker } from "./MicCheck";
import { useUserStore } from "../../store/userStore";

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
  const [isRecording, setIsRecording] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<AudioChunk[]>([]);
  const [disableAll, setDisableAll] = useState(false);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const enableProctorModeRef = useRef(false);

  const [setupFullScreen, setSetupFullScreen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const chunkTimerRef = useRef<NodeJS.Timeout | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const setCurrentWarnings = useUserStore((state) => state.setCurrentWarnings);

  const currentWarnings = useUserStore((state) => state.currentWarnings);

  const maximumWarnings = useUserStore((state) => state.maxWarnings);

  // FIX: keep an always-fresh flag to control segment restarts between onstop callbacks
  const isRecordingRef = useRef<boolean>(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const { questions } = useQuestionStore();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(async () => {
      // Wrap in an async function
      const checkTimer = async () => {
        const remaining = 20 * 60 * 1000 - (Date.now() - questionStartTime); // 20 mins
        const safeRemaining = Math.max(remaining, 0);
        setTimeSpent(safeRemaining);

        if (safeRemaining === 0) {
          toggleRecording();
          clearInterval(timer);
          setDisableAll(true);

          toast.info("⏰ Time's up! Moving to the Result Page.");

          const waitTime = new Promise((resolve) =>
            setTimeout(resolve, 1000 * 10)
          );
          toast.promise(waitTime, {
            loading: "10,9,8..... ends in 10 seconds",
          });

          if (isRecording) {
            await stopRecording();
            // Wait a bit for the final chunk to be processed
            await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
          }

          onComplete(responses);
        }
      };

      checkTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [questionStartTime]);

  useEffect(() => {
    if (currentWarnings === 0) return;
    if (currentWarnings >= maximumWarnings) {
      toast.error("Closing the session maximum warning reached");
      setCurrentWarnings(0);
      handleExit();
      return;
    }
    toast.warning(
      "You have moved out of proctored mode " +
        currentWarnings +
        " of " +
        maximumWarnings +
        " warnings remaining"
    );
  }, [currentWarnings]);

  const updateWarnings = async () => {
    if (enableProctorModeRef.current === false) return;
    const sessionId = localStorage.getItem("sessionId") || "default-session";
    const updateInfo = await axios.put(
      API_URL + "/user/warning?sessionId=" + sessionId,
      {},
      { headers: { Authorization: "Bearer " + Cookies.get("auth") } }
    );
    const info = await axios.get(
      API_URL + "/user/warning?sessionId=" + sessionId,
      {
        headers: { Authorization: "Bearer " + Cookies.get("auth") },
      }
    );

    setCurrentWarnings(info.data.count);

    if (updateInfo.data.terminateSession === true) {
      toast.error("Closing the session maximum warning reached");
      setCurrentWarnings(0);
      handleExit();
      return;
    }
  };

  useEffect(() => {
    const handleBlur = async () => {
      try {
        await updateWarnings();
        // toast.error("🚨 You left the exam window!");
      } catch (err) {
        console.log(err);
      }
    };

    // const handleMouseLeave = async (e) => {
    //   if (!e.toElement && !e.relatedTarget) {
    //     await updateWarnings();
    //     // toast.error("🚨 Cursor left the exam screen!");
    //   }
    // };

    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement) {
        await updateWarnings();
        // toast.error("🚨 You exited fullscreen!");
      }
    };

    window.addEventListener("blur", handleBlur);
    // document.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      // document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const enableSafeMode = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
      setSetupFullScreen(true);
    }
    enableProctorModeRef.current = true;
  };

  // Send audio chunk to backend for transcription
  const transcribeAudioChunk = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      console.log("🎤 Sending audio chunk for transcription...", {
        size: audioBlob.size,
        type: audioBlob.type,
      });

      // FIX: Always enforce correct MIME type for backend compatibility
      const fixedBlob = new Blob([audioBlob], { type: "audio/webm" });

      if (fixedBlob.size === 0 || !fixedBlob.type) {
        console.warn("⚠️ Empty audio blob, skipping transcription");
        return;
      }

      const formData = new FormData();
      formData.append("audio", fixedBlob, `audio_chunk_${Date.now()}.webm`);

      const sessionId = localStorage.getItem("sessionId") || "default-session";

      const response = await fetch(
        API_URL + "/audio/transcribe/?sessionId=" + sessionId,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${Cookies.get("auth") || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // console.log("📝 Transcription result:", result.text);

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
      toast.error(
        "Failed to transcribe audio. Please check your network connection."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const processAudioChunk = async (blob: Blob) => {
    console.log("Processing audio chunk:", {
      size: blob.size,
      type: blob.type,
      constructor: blob.constructor.name,
    });

    if (!(blob instanceof Blob) || blob.size === 0) {
      console.warn("Invalid or empty blob, skipping");
      return;
    }

    try {
      // FIX: Normalize every chunk to standalone WebM before upload/playback
      const fixedBlob = new Blob([blob], { type: "audio/webm" });

      // const debugUrl = URL.createObjectURL(fixedBlob);
      // console.log(
      //   "🎧 New audio chunk blob:",
      //   debugUrl,
      //   " type:",
      //   fixedBlob.type
      // );
      // setTimeout(() => URL.revokeObjectURL(debugUrl), 100000);

      const audioChunk: AudioChunk = {
        blob: fixedBlob,
        timestamp: Date.now(),
        duration: 0,
      };
      setRecordedChunks((prev) => [...prev, audioChunk]);

      // ✅ Send normalized blob
      await transcribeAudioChunk(fixedBlob);
    } catch (error) {
      console.error("Error processing audio chunk:", error);
    }
  };

  // FIX: Segment-by-segment recording to ensure each chunk has full headers
  const startRecording = async () => {
    try {
      console.log("🎤 Starting recording...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      let selectedMimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(selectedMimeType)) {
        selectedMimeType = "audio/webm"; // fallback
      }

      console.log("Using MIME type:", selectedMimeType);

      if (!selectedMimeType) {
        throw new Error("No supported audio MIME type found");
      }

      setIsRecording(true);

      const SLICE_MS = 11000; // FIX: target slice size

      const startSegment = () => {
        if (!streamRef.current) return;

        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: selectedMimeType,
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          console.log("Data available event:", {
            dataSize: event.data.size,
            dataType: event.data.type,
          });

          if (event.data && event.data.size > 0) {
            // Ensure each segment is a complete WebM blob
            const fixed = new Blob([event.data], { type: "audio/webm" }); // FIX
            await processAudioChunk(fixed);
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          toast.error("Recording error occurred");
        };

        mediaRecorder.onstop = () => {
          // Start next segment only if overall recording is still active
          if (isRecordingRef.current && streamRef.current) {
            // Immediately start the next segment
            startSegment(); // FIX: restart to inject fresh headers per chunk
          }
        };

        mediaRecorder.start(); // start this segment

        // Stop this segment after SLICE_MS to finalize a standalone file with headers
        if (chunkTimerRef.current) clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, SLICE_MS);
      };

      // Kick off first segment
      startSegment();
    } catch (err) {
      console.error("❌ Failed to access microphone:", err);
      toast.error(
        "Failed to access microphone. Please check your permissions."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    console.log("🛑 Stopping recording...");

    // Signal no more segment restarts
    isRecordingRef.current = false; // FIX: stop segment loop

    // Clear the chunk timer
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      isRecordingRef.current = true;
      startRecording();
    }
  };

  const handleNextQuestion = async () => {
    if (isRecording) {
      await stopRecording();
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2));
    }

    // Save current response
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = currentResponse;
    setResponses(updatedResponses);

    // Check if this is the last question
    if (currentQuestionIndex === questions.length - 1) {
      onComplete(updatedResponses);
      return;
    }

    setIsLoadingNextQuestion(true);

    try {
      // Send current response to backend to check for follow-up
      const sessionId = localStorage.getItem("sessionId");
      const token = Cookies.get("auth");

      const response = await axios.post(
        `${API_URL}/user/answer?sessionId=${sessionId}`,
        {
          questionId: currentQuestion.id,
          userAnswer: currentResponse,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.followUpQuestion) {
        // Add follow-up question to the store
        const followUpQuestion = {
          id: response.data.followQuestion.id,
          question: response.data.followQuestion.question,
          isCompleted: false,
          isFollowUp: true,
        };

        // Insert follow-up question right after current question
        const updatedQuestions = [...questions];
        updatedQuestions.splice(currentQuestionIndex + 1, 0, followUpQuestion);
        useQuestionStore.getState().setQuestions(updatedQuestions);
      }

      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } catch (error: AxiosError) {
      toast.error(error?.response?.data?.error);
      // If there's an error, just move to next question normally
      // setCurrentQuestionIndex(currentQuestionIndex + 1);
    } finally {
      setIsLoadingNextQuestion(false);
    }

    setCurrentResponse("");
  };

  const handleExit = async () => {
    onComplete([]);
    return;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {!setupFullScreen ? (
        <div className="flex flex-col h-screen justify-between px-6 py-6 md:py-8">
          {/* Top Section */}
          <div className="flex gap-4 items-center text-sm md:text-base">
            <Clock className="text-black dark:text-white" size={18} />
            <p className="text-black dark:text-white">Time Left</p>
            <span className="font-medium text-black dark:text-white">
              {formatTime(timeSpent)}
            </span>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col justify-center items-center gap-6 flex-grow">
            {showModal && (
              <MicSetupModal onContinue={() => setShowModal(false)} />
            )}
            {!showModal && (
              <p className="text-black dark:text-white text-lg font-medium text-center">
                Please make sure your microphone is working before starting.
              </p>
            )}

            <MicChecker />
            {/* Instructions */}
            <div className="w-full max-w-lg bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-4 text-sm md:text-base text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                Instructions
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Find a quiet environment with minimal background noise.</li>
                <li>
                  Ensure your microphone is connected and working properly.
                </li>
                <li>Be ready to answer questions as naturally as possible.</li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-center pb-4 w-full">
            <Button
              onClick={enableSafeMode}
              className="px-8 py-3 w-full sm:w-2/3 md:w-1/3 lg:w-1/4 text-lg font-semibold rounded-xl shadow-md"
            >
              Start Interview
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
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
                {/* <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium  bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                  >
                    {"Easy"}
                  </span>

                  {
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium  bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                    >
                      {"followUP"}
                    </span>
                  }
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {"Technical"}
                  </span>
                </div> */}

                <h2 className="lg:text-2xl text-xl font-bold text-gray-900 dark:text-white leading-tight whitespace-pre-line">
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
                    {isTranscribing && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Transcribing...
                      </span>
                    )}

                    <motion.button
                      onClick={toggleRecording}
                      disabled={disableAll}
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
                  placeholder="🎤 Tap the mic to talk (your words will appear automatically — you can edit later) or just start typing…"
                  className="w-full  h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* {recordedChunks.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Recorded {recordedChunks.length} audio chunk
                    {recordedChunks.length !== 1 ? "s" : ""}
                  </div>
                )} */}
              </div>

              {/* Action Buttons */}
              <div className="flex lg:justify-end justify-center gap-4 items-center pt-4">
                <Button
                  onClick={handleNextQuestion}
                  disabled={isLoadingNextQuestion || disableAll}
                  className="flex items-center  space-x-2"
                >
                  <span className="lg:text-md text-xs">
                    {isLoadingNextQuestion
                      ? "Processing..."
                      : currentQuestionIndex === questions.length - 1
                      ? "Finish Interview"
                      : "Next Question"}
                  </span>
                  <ArrowRight size={16} />
                </Button>

                <Button
                  disabled={isLoadingNextQuestion || disableAll}
                  onClick={handleExit}
                  className="flex items-center space-x-2"
                >
                  <span className="lg:text-md text-xs">Exit</span>
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
