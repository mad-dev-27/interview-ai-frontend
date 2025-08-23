import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Header } from "./components/Layout/Header";
import { AuthForm } from "./components/Auth/AuthForm";
import { LandingPage } from "./components/Landing/LandingPage";
import { PreInterviewSetup } from "./components/Interview/PreInterviewSetup";
import { InterviewInterface } from "./components/Interview/InterviewInterface";
import { ResultsPage } from "./components/Results/ResultsPage";

// Protected Route Component
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return user ? <>{children}</> : <Navigate to="/auth" replace />;
// };

// Dashboard Component
const Dashboard: React.FC = () => {
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
    setCurrentView("setup");
    setInterviewResponses([]);
    setInterviewData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
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

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing Page - Public Route */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <LandingPage />
          </div>
        }
      />

      {/* Auth Page - Public Route */}
      <Route path="/auth" element={<AuthForm />} />

      {/* Dashboard - Protected Route */}
      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute>
          <Dashboard />
          // </ProtectedRoute>
        }
      />

      {/* Redirect any unknown routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
