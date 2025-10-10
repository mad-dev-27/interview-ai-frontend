import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { Header } from '../components/Layout/Header';
import { ResumeForm } from '../components/ResumeBuilder/ResumeForm';
import { ResumePreview } from '../components/ResumeBuilder/ResumePreview';
import { ATSScoreCard } from '../components/ResumeBuilder/ATSScoreCard';
import { JobDescriptionInput } from '../components/ResumeBuilder/JobDescriptionInput';
import { Button } from '../components/ui/Button';
import { FileText, Download, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showJobDescModal, setShowJobDescModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const {
    currentResume,
    atsAnalysis,
    initializeNewResume,
    setATSAnalysis,
    setError,
  } = useResumeStore();

  useEffect(() => {
    if (!currentResume) {
      initializeNewResume();
    }
  }, [currentResume, initializeNewResume]);

  const handleOptimizeWithAI = async (jobDescription?: string) => {
    if (!currentResume) {
      toast.error('Please fill in your resume information first');
      return;
    }

    setIsOptimizing(true);
    try {
      const { analyzeResumeATS } = await import('../services/atsService');
      const analysis = await analyzeResumeATS(currentResume, jobDescription);
      setATSAnalysis(analysis);
      toast.success('Resume analyzed successfully!');
      setShowJobDescModal(false);
    } catch (error) {
      console.error('Optimization error:', error);
      setError('Failed to optimize resume. Please try again.');
      toast.error('Failed to optimize resume');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = async () => {
    if (!currentResume) {
      toast.error('No resume to download');
      return;
    }

    try {
      const element = document.getElementById('resume-content');
      if (!element) {
        toast.error('Resume preview not found');
        return;
      }

      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 0.5,
        filename: `${currentResume.personalInfo.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    }
  };

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Resume Builder
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Create an ATS-friendly resume with AI-powered optimization
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                onClick={() => setShowJobDescModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Optimize with AI</span>
                <span className="sm:hidden">Optimize</span>
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                Download
              </Button>
              <Button
                onClick={() => setShowMobilePreview(true)}
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2 text-xs sm:text-sm"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                Preview
              </Button>
            </div>
          </div>

          {atsAnalysis && (
            <div className="mb-4 sm:mb-6">
              <ATSScoreCard analysis={atsAnalysis} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full">
            <ResumeForm />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-4">
              <ResumePreview resume={currentResume} />
            </div>
          </div>
        </div>
      </div>

      {showJobDescModal && (
        <JobDescriptionInput
          onClose={() => setShowJobDescModal(false)}
          onOptimize={handleOptimizeWithAI}
          isLoading={isOptimizing}
        />
      )}

      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Preview</h2>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-auto p-4">
              <ResumePreview resume={currentResume} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
