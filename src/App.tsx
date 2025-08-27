import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Layout/Header";
import { AuthForm } from "./components/Auth/AuthForm";
import { LandingPage } from "./components/Landing/LandingPage";
import ProtectedRoute from "./components/protectRoute/protectRoute";
import { Suspense, lazy } from "react";

// Lazy-loaded pages/components
const Dashboard = lazy(() => import("./pages/dashboard"));
const InterviewFlow = lazy(() => import("./pages/interview"));
const MockInterviewSetup = lazy(
  () => import("./components/MockInterview/MockInterviewSetup")
);

function AppContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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

        {/* Mock Interview Setup - Public Route */}
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <MockInterviewSetup />
            </ProtectedRoute>
          }
        />

        {/* Interview Flow - Public Route */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewFlow />
            </ProtectedRoute>
          }
        />

        {/* Dashboard - Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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
