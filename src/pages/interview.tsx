import { useLocation, useNavigate } from "react-router-dom";
import { InterviewInterface } from "../components/Interview/InterviewInterface";
import { PreInterviewSetup } from "../components/Interview/PreInterviewSetup";
import { ResultsPage } from "../components/Results/ResultsPage";
import React from "react";

// Interview Flow Component
const InterviewFlow: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<
    "setup" | "interview" | "results"
  >("setup");
  const [interviewResponses, setInterviewResponses] = React.useState<string[]>(
    []
  );
  const [interviewData, setInterviewData] = React.useState<{
    jobDescription: string;
    resume: File | null;
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if we have data from mock interview setup
    if (location.state?.jobDescription && location.state?.resume) {
      setInterviewData({
        jobDescription: location.state.jobDescription,
        resume: location.state.resume,
      });
      setCurrentView("interview");
    }
  }, [location.state]);

  const handleSetupComplete = (data: {
    jobDescription: string;
    resume: File | null;
  }) => {
    setInterviewData(data);
    setCurrentView("interview");
  };

  const handleInterviewComplete = (responses: string[]) => {
    setInterviewResponses(responses);
    setCurrentView("results");
  };

  const handleRestart = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen">
      {currentView === "setup" && (
        <PreInterviewSetup onComplete={handleSetupComplete} />
      )}
      {currentView === "interview" && (
        <InterviewInterface
          onComplete={handleInterviewComplete}
          jobDescription={interviewData?.jobDescription || ""}
          resume={interviewData?.resume || null}
        />
      )}
      {currentView === "results" && (
        <ResultsPage
          responses={interviewResponses}
          jobDescription={interviewData?.jobDescription || ""}
          resume={interviewData?.resume || null}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default InterviewFlow;
