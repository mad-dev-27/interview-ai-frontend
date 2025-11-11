import { useResumeStore } from '../../store/resumeStore';
import { Certification } from '../../types/resumeTypes';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function CertificationsForm() {
  const { currentResume, addCertification, updateCertification, deleteCertification } =
    useResumeStore();

  if (!currentResume) return null;

  const { certifications } = currentResume;

  const handleAdd = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
    };
    addCertification(newCert);
  };

  const handleUpdate = (id: string, field: keyof Certification, value: any) => {
    updateCertification(id, { [field]: value });
  };

  return (
    <div className="space-y-6 pt-6">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {cert.name || 'New Certification'}
              </h3>
            </div>
            <button
              onClick={() => deleteCertification(cert.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Certification Name"
                value={cert.name}
                onChange={(e) => handleUpdate(cert.id, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect"
              />
              <Input
                label="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => handleUpdate(cert.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Date Obtained"
                type="month"
                value={cert.date}
                onChange={(e) => handleUpdate(cert.id, 'date', e.target.value)}
              />
              <Input
                label="Credential ID (Optional)"
                value={cert.credentialId || ''}
                onChange={(e) => handleUpdate(cert.id, 'credentialId', e.target.value)}
                placeholder="ABC123XYZ"
              />
              <Input
                label="Credential URL (Optional)"
                value={cert.credentialUrl || ''}
                onChange={(e) => handleUpdate(cert.id, 'credentialUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
