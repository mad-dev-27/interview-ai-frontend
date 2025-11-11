import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { PersonalInfoForm } from './PersonalInfoForm';
import { WorkExperienceForm } from './WorkExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export function ResumeForm() {
  const [expandedSections, setExpandedSections] = useState<Set<Section>>(
    new Set(['personal'])
  );

  const toggleSection = (section: Section) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const sections: { id: Section; title: string; component: React.ReactNode }[] = [
    { id: 'personal', title: 'Personal Information', component: <PersonalInfoForm /> },
    { id: 'experience', title: 'Work Experience', component: <WorkExperienceForm /> },
    { id: 'education', title: 'Education', component: <EducationForm /> },
    { id: 'skills', title: 'Skills', component: <SkillsForm /> },
    { id: 'projects', title: 'Projects', component: <ProjectsForm /> },
    { id: 'certifications', title: 'Certifications', component: <CertificationsForm /> },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {section.title}
            </h2>
            {expandedSections.has(section.id) ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {expandedSections.has(section.id) && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-700">
              {section.component}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
