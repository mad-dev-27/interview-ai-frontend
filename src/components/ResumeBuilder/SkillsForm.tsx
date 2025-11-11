import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { SkillCategory } from '../../types/resumeTypes';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, X } from 'lucide-react';

export function SkillsForm() {
  const { currentResume, addSkillCategory, updateSkillCategory, deleteSkillCategory } =
    useResumeStore();
  const [newSkillInputs, setNewSkillInputs] = useState<{ [key: string]: string }>({});

  if (!currentResume) return null;

  const { skills } = currentResume;

  const handleAdd = () => {
    const newCategory: SkillCategory = {
      id: crypto.randomUUID(),
      category: '',
      skills: [],
    };
    addSkillCategory(newCategory);
  };

  const handleUpdate = (id: string, field: keyof SkillCategory, value: any) => {
    updateSkillCategory(id, { [field]: value });
  };

  const handleAddSkill = (id: string) => {
    const skillText = newSkillInputs[id]?.trim();
    if (!skillText) return;

    const category = skills.find((s) => s.id === id);
    if (category) {
      updateSkillCategory(id, { skills: [...category.skills, skillText] });
      setNewSkillInputs({ ...newSkillInputs, [id]: '' });
    }
  };

  const handleRemoveSkill = (id: string, skillIndex: number) => {
    const category = skills.find((s) => s.id === id);
    if (category) {
      const newSkills = category.skills.filter((_, i) => i !== skillIndex);
      updateSkillCategory(id, { skills: newSkills });
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {skills.map((category) => (
        <div
          key={category.id}
          className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start justify-between mb-4">
            <Input
              label="Category Name"
              value={category.category}
              onChange={(e) => handleUpdate(category.id, 'category', e.target.value)}
              placeholder="e.g., Technical Skills, Languages"
              className="flex-1 mr-4"
            />
            <button
              onClick={() => deleteSkillCategory(category.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 mt-8"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {category.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(category.id, index)}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInputs[category.id] || ''}
                onChange={(e) =>
                  setNewSkillInputs({ ...newSkillInputs, [category.id]: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(category.id);
                  }
                }}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <Button onClick={() => handleAddSkill(category.id)} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Skill Category
      </Button>
    </div>
  );
}
