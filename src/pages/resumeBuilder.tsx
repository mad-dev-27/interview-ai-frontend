import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { Header } from '../components/Layout/Header';
import { ResumeForm } from '../components/ResumeBuilder/ResumeForm';
import { ResumePreview } from '../components/ResumeBuilder/ResumePreview';
import { ATSScoreCard } from '../components/ResumeBuilder/ATSScoreCard';
import { JobDescriptionInput } from '../components/ResumeBuilder/JobDescriptionInput';
import { Button } from '../components/ui/Button';
import { FileText, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
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

  const handleDownload = () => {
    if (!currentResume) {
      toast.error('No resume to download');
      return;
    }

    toast.info('Download feature coming soon!');
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Resume Builder
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create an ATS-friendly resume with AI-powered optimization
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowJobDescModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Optimize with AI
              </Button>
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          {atsAnalysis && (
            <div className="mb-6">
              <ATSScoreCard analysis={atsAnalysis} />
            </div>
          )}
        </div>

        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('form')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'form'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Edit Resume
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={activeTab === 'form' ? 'block' : 'hidden lg:block'}>
            <ResumeForm />
          </div>

          <div className={activeTab === 'preview' ? 'block' : 'hidden lg:block'}>
            <ResumePreview resume={currentResume} />
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
    </div>
  );
}
