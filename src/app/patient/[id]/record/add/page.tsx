'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usePatients } from '@/services/patientService';
import { MedicalRecord } from '@/types/patient';
import { 
  ChevronLeft, 
  ClipboardList,
  Calendar,
  Stethoscope,
  Save,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

type RecordFormData = Omit<MedicalRecord, 'id'>;

const initialFormData: RecordFormData = {
  date: new Date().toISOString().split('T')[0],
  type: 'visit',
  description: '',
  notes: '',
  doctor: ''
};

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  isTextArea = false
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  isTextArea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={cn(
            "w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 resize-none",
            error ? "border-rose-200 bg-rose-50/30" : "border-slate-100"
          )}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500",
            error ? "border-rose-200 bg-rose-50/30" : "border-slate-100"
          )}
        />
      )}
      {error && <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  error
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          "w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 appearance-none",
          error ? "border-rose-200 bg-rose-50/30" : "border-slate-100"
        )}
      >
        <option value="">Select Type...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{error}</p>}
    </div>
  );
}

export default function AddMedicalRecord() {
  const router = useRouter();
  const params = useParams();
  const { getPatientById, updatePatient } = usePatients();
  
  const [formData, setFormData] = useState<RecordFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patient = params.id ? getPatientById(params.id as string) : null;

  const updateField = (field: keyof RecordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) newErrors.description = 'Required';
    if (!formData.date) newErrors.date = 'Required';
    if (!formData.type) newErrors.type = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const newRecord: MedicalRecord = {
        ...formData,
        id: Date.now().toString(),
        type: formData.type as MedicalRecord['type']
      };
      
      const updatedHistory = [...(patient.medicalHistory || []), newRecord];
      updatePatient(patient.id, { medicalHistory: updatedHistory });
      
      router.push(`/patient/${patient.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-500 font-bold">Patient not found</p>
        <Link href="/" className="text-blue-600 font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <Link
            href={`/patient/${patient.id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {patient.firstName}'s Profile
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-[20px] shadow-lg shadow-blue-100">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Add Clinical Record</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Activity className="h-5 w-5" />
              <h2 className="text-lg font-black tracking-tight">Record Details</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Document a new medical event, visit, or treatment.</p>
          </div>
          
          <div className="md:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField 
                label="Date of Event" 
                type="date" 
                value={formData.date} 
                onChange={v => updateField('date', v)} 
                required 
                error={errors.date} 
              />
              <SelectField 
                label="Event Type" 
                value={formData.type} 
                onChange={v => updateField('type', v)} 
                required 
                error={errors.type}
                options={[
                  { value: 'visit', label: 'General Visit' },
                  { value: 'diagnosis', label: 'Diagnosis' },
                  { value: 'treatment', label: 'Treatment' },
                  { value: 'prescription', label: 'Prescription' },
                  { value: 'test', label: 'Medical Test' }
                ]}
              />
            </div>

            <FormField 
              label="Description / Title" 
              value={formData.description} 
              onChange={v => updateField('description', v)} 
              placeholder="e.g. Annual physical exam, Chest X-Ray" 
              required 
              error={errors.description} 
            />

            <FormField 
              label="Practitioner Name" 
              value={formData.doctor || ''} 
              onChange={v => updateField('doctor', v)} 
              placeholder="Dr. Smith" 
              error={errors.doctor} 
            />

            <FormField 
              label="Clinical Notes" 
              value={formData.notes || ''} 
              onChange={v => updateField('notes', v)} 
              placeholder="Detailed observations and notes..." 
              isTextArea 
              error={errors.notes} 
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-10 border-t border-slate-200">
          <Link
            href={`/patient/${patient.id}`}
            className="flex items-center gap-2 px-8 py-3 text-slate-500 font-bold hover:text-slate-700 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-[20px] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSubmitting ? 'Saving...' : 'Save Clinical Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

