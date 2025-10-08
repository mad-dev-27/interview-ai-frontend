import { Resume, ATSAnalysis } from '../types/resumeTypes';

const extractKeywords = (text: string): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
};

const getResumeText = (resume: Resume): string => {
  let text = `${resume.personalInfo.summary} `;

  resume.workExperience.forEach(exp => {
    text += `${exp.position} ${exp.company} ${exp.description.join(' ')} `;
  });

  resume.education.forEach(edu => {
    text += `${edu.degree} ${edu.fieldOfStudy} ${edu.institution} `;
  });

  resume.skills.forEach(category => {
    text += `${category.skills.join(' ')} `;
  });

  resume.projects.forEach(project => {
    text += `${project.name} ${project.description} ${project.technologies.join(' ')} `;
  });

  return text;
};

export const analyzeResumeATS = async (
  resume: Resume,
  jobDescription?: string
): Promise<ATSAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const resumeText = getResumeText(resume);
  const resumeKeywords = extractKeywords(resumeText);

  let analysis: ATSAnalysis;

  if (jobDescription) {
    const jdKeywords = extractKeywords(jobDescription);
    const matched = resumeKeywords.filter(keyword =>
      jdKeywords.includes(keyword)
    );
    const missing = jdKeywords
      .filter(keyword => !resumeKeywords.includes(keyword))
      .slice(0, 10);

    const matchPercentage = (matched.length / Math.max(jdKeywords.length, 1)) * 100;
    const baseScore = Math.min(Math.round(matchPercentage), 100);

    const hasContactInfo = resume.personalInfo.email && resume.personalInfo.phone;
    const hasSummary = resume.personalInfo.summary.length > 50;
    const hasExperience = resume.workExperience.length > 0;
    const hasEducation = resume.education.length > 0;
    const hasSkills = resume.skills.length > 0;

    let adjustedScore = baseScore;
    if (hasContactInfo) adjustedScore += 5;
    if (hasSummary) adjustedScore += 5;
    if (hasExperience) adjustedScore += 5;
    if (hasEducation) adjustedScore += 3;
    if (hasSkills) adjustedScore += 2;

    const finalScore = Math.min(Math.max(adjustedScore, 0), 100);

    const suggestions: string[] = [];
    if (!hasContactInfo) suggestions.push('Add complete contact information');
    if (!hasSummary) suggestions.push('Add a professional summary (at least 50 characters)');
    if (!hasExperience) suggestions.push('Add work experience with bullet points');
    if (!hasEducation) suggestions.push('Add your educational background');
    if (!hasSkills) suggestions.push('Add relevant skills organized by category');
    if (missing.length > 0) {
      suggestions.push(`Include these keywords from the job description: ${missing.slice(0, 5).join(', ')}`);
    }
    if (resume.workExperience.some(exp => exp.description.length === 0)) {
      suggestions.push('Add detailed descriptions to all work experiences');
    }
    if (finalScore < 70) {
      suggestions.push('Use action verbs to start your bullet points (e.g., "Led", "Developed", "Managed")');
      suggestions.push('Quantify your achievements with numbers and percentages where possible');
    }

    analysis = {
      score: finalScore,
      keywordMatches: {
        matched,
        missing,
      },
      suggestions,
      optimizedContent: {},
    };
  } else {
    const hasContactInfo = resume.personalInfo.email && resume.personalInfo.phone;
    const hasSummary = resume.personalInfo.summary.length > 50;
    const hasExperience = resume.workExperience.length > 0;
    const hasEducation = resume.education.length > 0;
    const hasSkills = resume.skills.length > 0;
    const hasProjects = resume.projects.length > 0;

    let score = 60;
    if (hasContactInfo) score += 10;
    if (hasSummary) score += 10;
    if (hasExperience) score += 10;
    if (hasEducation) score += 5;
    if (hasSkills) score += 5;
    if (hasProjects) score += 5;

    const suggestions: string[] = [];
    if (!hasContactInfo) suggestions.push('Add complete contact information (email and phone)');
    if (!hasSummary) suggestions.push('Add a compelling professional summary');
    if (!hasExperience) suggestions.push('Add relevant work experience');
    if (!hasEducation) suggestions.push('Include your educational background');
    if (!hasSkills) suggestions.push('List your technical and soft skills');
    if (resume.workExperience.some(exp => exp.description.length < 2)) {
      suggestions.push('Add at least 2-3 bullet points for each work experience');
    }
    suggestions.push('Use industry-standard keywords relevant to your field');
    suggestions.push('Keep formatting simple and avoid graphics or tables');
    suggestions.push('Use standard section headings like "Experience", "Education", "Skills"');

    analysis = {
      score: Math.min(score, 100),
      keywordMatches: {
        matched: resumeKeywords.slice(0, 10),
        missing: [],
      },
      suggestions: suggestions.slice(0, 8),
      optimizedContent: {},
    };
  }

  return analysis;
};

export const optimizeResumeContent = (resume: Resume, jobDescription?: string) => {
  return analyzeResumeATS(resume, jobDescription);
};
