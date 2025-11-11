import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Project } from '../../types/resumeTypes';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';

export function ProjectsForm() {
  const { currentResume, addProject, updateProject, deleteProject } = useResumeStore();
  const [newTechInputs, setNewTechInputs] = useState<{ [key: string]: string }>({});

  if (!currentResume) return null;

  const { projects } = currentResume;

  const handleAdd = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      highlights: [''],
    };
    addProject(newProject);
  };

  const handleUpdate = (id: string, field: keyof Project, value: any) => {
    updateProject(id, { [field]: value });
  };

  const handleAddTechnology = (id: string) => {
    const techText = newTechInputs[id]?.trim();
    if (!techText) return;

    const project = projects.find((p) => p.id === id);
    if (project) {
      updateProject(id, { technologies: [...project.technologies, techText] });
      setNewTechInputs({ ...newTechInputs, [id]: '' });
    }
  };

  const handleRemoveTechnology = (id: string, techIndex: number) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      const newTechs = project.technologies.filter((_, i) => i !== techIndex);
      updateProject(id, { technologies: newTechs });
    }
  };

  const handleHighlightChange = (id: string, index: number, value: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      const newHighlights = [...project.highlights];
      newHighlights[index] = value;
      updateProject(id, { highlights: newHighlights });
    }
  };

  const handleAddHighlight = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      updateProject(id, { highlights: [...project.highlights, ''] });
    }
  };

  const handleRemoveHighlight = (id: string, index: number) => {
    const project = projects.find((p) => p.id === id);
    if (project && project.highlights.length > 1) {
      const newHighlights = project.highlights.filter((_, i) => i !== index);
      updateProject(id, { highlights: newHighlights });
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {project.name || 'New Project'}
              </h3>
            </div>
            <button
              onClick={() => deleteProject(project.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              label="Project Name"
              value={project.name}
              onChange={(e) => handleUpdate(project.id, 'name', e.target.value)}
              placeholder="My Awesome Project"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleUpdate(project.id, 'description', e.target.value)}
                placeholder="Brief description of the project..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <Input
              label="Project Link (Optional)"
              value={project.link || ''}
              onChange={(e) => handleUpdate(project.id, 'link', e.target.value)}
              placeholder="https://github.com/username/project"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => handleRemoveTechnology(project.id, index)}
                      className="hover:text-green-900 dark:hover:text-green-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechInputs[project.id] || ''}
                  onChange={(e) =>
                    setNewTechInputs({ ...newTechInputs, [project.id]: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechnology(project.id);
                    }
                  }}
                  placeholder="Add a technology"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <Button onClick={() => handleAddTechnology(project.id)} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Highlights
              </label>
              {project.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <span className="text-gray-500 dark:text-gray-400 mt-2">•</span>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(project.id, index, e.target.value)}
                    placeholder="Project highlight or achievement"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  {project.highlights.length > 1 && (
                    <button
                      onClick={() => handleRemoveHighlight(project.id, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                onClick={() => handleAddHighlight(project.id)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Highlight
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}
