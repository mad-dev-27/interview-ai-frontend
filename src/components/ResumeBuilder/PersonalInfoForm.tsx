import { useResumeStore } from '../../store/resumeStore';
import { Input } from '../ui/Input';

export function PersonalInfoForm() {
  const { currentResume, updatePersonalInfo } = useResumeStore();

  if (!currentResume) return null;

  const { personalInfo } = currentResume;

  const handleChange = (field: string, value: string) => {
    updatePersonalInfo({
      ...personalInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          required
        />
        <Input
          label="Location"
          value={personalInfo.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="San Francisco, CA"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="LinkedIn (Optional)"
          value={personalInfo.linkedIn || ''}
          onChange={(e) => handleChange('linkedIn', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
        />
        <Input
          label="Portfolio (Optional)"
          value={personalInfo.portfolio || ''}
          onChange={(e) => handleChange('portfolio', e.target.value)}
          placeholder="johndoe.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Professional Summary
        </label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a brief professional summary highlighting your key skills and experience..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  );
}
