import { Resume } from '../../types/resumeTypes';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = resume;

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
      <div className="p-4 sm:p-6 lg:p-8 overflow-auto text-black max-h-[calc(100vh-8rem)] lg:max-h-[calc(100vh-2rem)]" id="resume-content">
        <div className="mb-4 sm:mb-6 border-b-2 border-gray-800 pb-3 sm:pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedIn && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                {personalInfo.linkedIn}
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {personalInfo.portfolio}
              </div>
            )}
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 uppercase border-b border-gray-300">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {workExperience.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase border-b border-gray-300">
              Professional Experience
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-xs sm:text-sm text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 sm:text-right">
                    <p>
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-800 space-y-1 ml-2">
                    {exp.description.filter(d => d.trim()).map((desc, idx) => (
                      <li key={idx} className="break-words">{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase border-b border-gray-300">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 sm:mb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-xs sm:text-sm text-gray-700">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-xs sm:text-sm text-gray-600">Major: {edu.fieldOfStudy}</p>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 sm:text-right">
                    <p>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {edu.location && <p>{edu.location}</p>}
                  </div>
                </div>
                {edu.gpa && <p className="text-xs sm:text-sm text-gray-700">GPA: {edu.gpa}</p>}
                {edu.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-800 mt-1 ml-2">
                    {edu.achievements.filter(a => a.trim()).map((achievement, idx) => (
                      <li key={idx} className="break-words">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase border-b border-gray-300">
              Skills
            </h2>
            {skills.map((category) => (
              <div key={category.id} className="mb-2">
                <span className="text-sm sm:text-base font-semibold text-gray-900">{category.category}: </span>
                <span className="text-xs sm:text-sm text-gray-800 break-words">{category.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase border-b border-gray-300">
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2 sm:mb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} className="text-xs sm:text-sm text-blue-600 hover:underline break-all">
                      Link
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-xs sm:text-sm text-gray-800 mb-1 break-words">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Technologies: </span>
                    <span className="break-words">{project.technologies.join(', ')}</span>
                  </p>
                )}
                {project.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-800 ml-2">
                    {project.highlights.filter(h => h.trim()).map((highlight, idx) => (
                      <li key={idx} className="break-words">{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase border-b border-gray-300">
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-700">{cert.issuer}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{formatDate(cert.date)}</p>
                </div>
                {cert.credentialId && (
                  <p className="text-xs text-gray-600 break-all">Credential ID: {cert.credentialId}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
