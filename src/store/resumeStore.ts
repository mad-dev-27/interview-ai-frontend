import { create } from 'zustand';
import {
  Resume,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
  ATSAnalysis,
} from '../types/resumeTypes';

interface ResumeState {
  currentResume: Resume | null;
  atsAnalysis: ATSAnalysis | null;
  isLoading: boolean;
  error: string | null;

  setCurrentResume: (resume: Resume) => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addWorkExperience: (exp: WorkExperience) => void;
  updateWorkExperience: (id: string, exp: Partial<WorkExperience>) => void;
  deleteWorkExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  addSkillCategory: (category: SkillCategory) => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  setATSAnalysis: (analysis: ATSAnalysis) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeNewResume: () => void;
  resetResume: () => void;
}

const createEmptyResume = (): Resume => ({
  id: crypto.randomUUID(),
  title: 'My Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useResumeStore = create<ResumeState>((set) => ({
  currentResume: null,
  atsAnalysis: null,
  isLoading: false,
  error: null,

  setCurrentResume: (resume) => set({ currentResume: resume }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, personalInfo: info, updatedAt: new Date().toISOString() }
        : null,
    })),

  addWorkExperience: (exp) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            workExperience: [...state.currentResume.workExperience, exp],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateWorkExperience: (id, exp) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            workExperience: state.currentResume.workExperience.map((item) =>
              item.id === id ? { ...item, ...exp } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  deleteWorkExperience: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            workExperience: state.currentResume.workExperience.filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  addEducation: (edu) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            education: [...state.currentResume.education, edu],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateEducation: (id, edu) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            education: state.currentResume.education.map((item) =>
              item.id === id ? { ...item, ...edu } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  deleteEducation: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            education: state.currentResume.education.filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  addSkillCategory: (category) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            skills: [...state.currentResume.skills, category],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateSkillCategory: (id, category) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            skills: state.currentResume.skills.map((item) =>
              item.id === id ? { ...item, ...category } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  deleteSkillCategory: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            skills: state.currentResume.skills.filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  addProject: (project) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            projects: [...state.currentResume.projects, project],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateProject: (id, project) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            projects: state.currentResume.projects.map((item) =>
              item.id === id ? { ...item, ...project } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  deleteProject: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            projects: state.currentResume.projects.filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  addCertification: (cert) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            certifications: [...state.currentResume.certifications, cert],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateCertification: (id, cert) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            certifications: state.currentResume.certifications.map((item) =>
              item.id === id ? { ...item, ...cert } : item
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  deleteCertification: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            certifications: state.currentResume.certifications.filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  setATSAnalysis: (analysis) => set({ atsAnalysis: analysis }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  initializeNewResume: () => set({ currentResume: createEmptyResume(), atsAnalysis: null }),

  resetResume: () => set({ currentResume: null, atsAnalysis: null, error: null }),
}));
