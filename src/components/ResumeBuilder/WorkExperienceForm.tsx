import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { WorkExperience } from '../../types/resumeTypes';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function WorkExperienceForm() {
  const { currentResume, addWorkExperience, updateWorkExperience, deleteWorkExperience } =
    useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!currentResume) return null;

  const { workExperience } = currentResume;

  const handleAdd = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: [''],
    };
    addWorkExperience(newExp);
    setEditingId(newExp.id);
  };

  const handleUpdate = (id: string, field: keyof WorkExperience, value: any) => {
    updateWorkExperience(id, { [field]: value });
  };

  const handleDescriptionChange = (id: string, index: number, value: string) => {
    const exp = workExperience.find((e) => e.id === id);
    if (exp) {
      const newDescription = [...exp.description];
      newDescription[index] = value;
      updateWorkExperience(id, { description: newDescription });
    }
  };

  const handleAddDescription = (id: string) => {
    const exp = workExperience.find((e) => e.id === id);
    if (exp) {
      updateWorkExperience(id, { description: [...exp.description, ''] });
    }
  };

  const handleRemoveDescription = (id: string, index: number) => {
    const exp = workExperience.find((e) => e.id === id);
    if (exp && exp.description.length > 1) {
      const newDescription = exp.description.filter((_, i) => i !== index);
      updateWorkExperience(id, { description: newDescription });
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {workExperience.map((exp) => (
        <div
          key={exp.id}
          className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {exp.company || 'New Position'}
              </h3>
            </div>
            <button
              onClick={() => deleteWorkExperience(exp.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company"
                value={exp.company}
                onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                placeholder="Company Name"
              />
              <Input
                label="Position"
                value={exp.position}
                onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                placeholder="Job Title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Location"
                value={exp.location}
                onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                placeholder="City, State"
              />
              <Input
                label="Start Date"
                type="month"
                value={exp.startDate}
                onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="month"
                value={exp.endDate}
                onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                disabled={exp.isCurrent}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => handleUpdate(exp.id, 'isCurrent', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              I currently work here
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Responsibilities & Achievements
              </label>
              {exp.description.map((desc, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <span className="text-gray-500 dark:text-gray-400 mt-2">•</span>
                  <textarea
                    value={desc}
                    onChange={(e) => handleDescriptionChange(exp.id, index, e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  {exp.description.length > 1 && (
                    <button
                      onClick={() => handleRemoveDescription(exp.id, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                onClick={() => handleAddDescription(exp.id)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Point
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
}
