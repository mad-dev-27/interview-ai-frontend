import { useResumeStore } from '../../store/resumeStore';
import { Education } from '../../types/resumeTypes';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function EducationForm() {
  const { currentResume, addEducation, updateEducation, deleteEducation } = useResumeStore();

  if (!currentResume) return null;

  const { education } = currentResume;

  const handleAdd = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: [],
    };
    addEducation(newEdu);
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    updateEducation(id, { [field]: value });
  };

  const handleAchievementChange = (id: string, index: number, value: string) => {
    const edu = education.find((e) => e.id === id);
    if (edu) {
      const newAchievements = [...edu.achievements];
      newAchievements[index] = value;
      updateEducation(id, { achievements: newAchievements });
    }
  };

  const handleAddAchievement = (id: string) => {
    const edu = education.find((e) => e.id === id);
    if (edu) {
      updateEducation(id, { achievements: [...edu.achievements, ''] });
    }
  };

  const handleRemoveAchievement = (id: string, index: number) => {
    const edu = education.find((e) => e.id === id);
    if (edu) {
      const newAchievements = edu.achievements.filter((_, i) => i !== index);
      updateEducation(id, { achievements: newAchievements });
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {education.map((edu) => (
        <div
          key={edu.id}
          className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {edu.institution || 'New Education'}
              </h3>
            </div>
            <button
              onClick={() => deleteEducation(edu.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution"
                value={edu.institution}
                onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                placeholder="University Name"
              />
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) => handleUpdate(edu.id, 'fieldOfStudy', e.target.value)}
                placeholder="Computer Science"
              />
              <Input
                label="Location"
                value={edu.location}
                onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                placeholder="City, State"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={edu.startDate}
                onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="month"
                value={edu.endDate}
                onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
              />
              <Input
                label="GPA (Optional)"
                value={edu.gpa || ''}
                onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
              />
            </div>

            {edu.achievements.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Achievements & Honors
                </label>
                {edu.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="text-gray-500 dark:text-gray-400 mt-2">•</span>
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(edu.id, index, e.target.value)}
                      placeholder="Achievement or honor"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => handleRemoveAchievement(edu.id, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={() => handleAddAchievement(edu.id)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Achievement
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
