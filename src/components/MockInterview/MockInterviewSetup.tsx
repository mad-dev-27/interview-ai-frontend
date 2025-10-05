import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Briefcase, ArrowRight, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../../config";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQuestionStore } from "../../store/interviewStore";
import InterviewRulesModal from "./agreeModal";
import { BackButton } from "../ui/BackButton";
import { Breadcrumb } from "../ui/Breadcrumb";

const MockInterviewSetup: React.FC = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{
    jobDescription?: string;
    resume?: string;
  }>({});
  const [showRules, setShowRules] = useState(true);

  const { setQuestions } = useQuestionStore();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
        setErrors((prev) => ({ ...prev, resume: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF file only",
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
        setErrors((prev) => ({ ...prev, resume: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF file only",
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newErrors: { jobDescription?: string; resume?: string } = {};

    if (!jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }

    if (!resume) {
      newErrors.resume = "Resume upload is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const session = localStorage.getItem("sessionId");

    const token = Cookies.get("auth");

    const formData = new FormData();

    formData.append("jobDescription", jobDescription.trim());

    if (!resume) {
      throw new Error("resume is missing");
    }

    formData.append("file", resume, "resume.pdf");

    const preInterviewSetup = axios.post(
      API_URL + "/user/preInterview?sessionId=" + session,
      formData,
      { headers: { Authorization: "Bearer " + token } }
    );

    toast.promise(preInterviewSetup, {
      loading: "⚡ Setting things up... this won’t take long!",
      success: (data: AxiosResponse) => {
        setQuestions(data.data.questions);

        setLoading(false);

        navigate("/interview", {
          state: {
            jobDescription: jobDescription.trim(),
            resume,
          },
        });
        return "🎉 All done! Your questions are ready to roll.";
      },
      error: (err: AxiosError<{ error?: string }>) => {
        setLoading(false);

        const serverError = err.response?.data?.error;

        if (serverError) {
          try {
            const jsonPart = serverError.replace(/^Error:\s*/, "");
            const parsed = JSON.parse(jsonPart);

            if (!parsed.jdValid && !parsed.resumeValid) {
              return "❌ Both the Job Description and Resume look invalid. Please fix them and try again.";
            }
            if (!parsed.jdValid) {
              return "⚠️ The Job Description doesn’t look valid. Please correct it and try again.";
            }
            if (!parsed.resumeValid) {
              return "⚠️ The Resume doesn’t look valid. Please correct it and try again.";
            }
          } catch {
            return "💥 Error while reading validation response. Try again.";
          }
        }

        return "😅 Something went wrong — please try again.";
      },
    });

    // Navigate to interview interface with data
  };

  const removeResume = () => {
    setResume(null);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  return (
    <>
      <div>
        {showRules && (
          <InterviewRulesModal onAgree={() => setShowRules(false)} />
        )}
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <BackButton to="/dashboard" label="Back to Dashboard" />
          <Breadcrumb items={[{ label: "Mock Interview Setup" }]} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mock Interview Setup
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Prepare for your personalized AI interview experience
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Job Description Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Job Description
                  </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                  Paste the job description or key requirements for the position
                  you're applying for. This helps us tailor the interview
                  questions to match the role.
                </p>

                <div className="space-y-2">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      if (errors.jobDescription) {
                        setErrors((prev) => ({
                          ...prev,
                          jobDescription: undefined,
                        }));
                      }
                    }}
                    placeholder="Paste the job description here..."
                    className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.jobDescription && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.jobDescription}
                    </p>
                  )}
                </div>
              </div>

              {/* Resume Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Resume Upload
                  </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                  Upload your resume in PDF format. We'll analyze it to ask
                  relevant questions about your experience and skills.
                </p>

                {!resume ? (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : errors.resume
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>

                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Drop your resume here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PDF files only, up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {resume.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(resume.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeResume}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {errors.resume && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.resume}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <span>Start Mock Interview</span>
                  <ArrowRight size={20} />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MockInterviewSetup;
