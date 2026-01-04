'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usePatients } from '@/services/patientService';
import { Patient } from '@/types/patient';
import { 
  ChevronLeft, 
  Info, 
  MapPin, 
  ShieldAlert, 
  Stethoscope,
  Plus,
  X,
  Save,
  UserRoundPen
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'medicalHistory'>;

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
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
        <option value="">Select Option...</option>
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

function ArrayField({
  label,
  values,
  onChange,
  placeholder,
  icon: Icon
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  icon?: any;
}) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim()) {
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            placeholder={placeholder}
            className={cn(
              "w-full py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500",
              Icon ? "pl-11 pr-4" : "px-4"
            )}
          />
        </div>
        <button
          type="button"
          onClick={addItem}
          className="px-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 text-xs font-bold transition-all hover:bg-blue-100 group">
            <span>{value}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-blue-300 hover:text-blue-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditPatient() {
  const router = useRouter();
  const params = useParams();
  const { getPatientById, updatePatient } = usePatients();
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id && !formData) {
      const patient = getPatientById(params.id as string);
      if (patient) {
        // Exclude fields not in FormData
        const { id, createdAt, updatedAt, medicalHistory, ...rest } = patient;
        setFormData(rest as FormData);
      } else {
        router.push('/');
      }
    }
  }, [params.id, getPatientById, router, formData]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => {
      if (!prev) return null;
      const keys = field.split('.');
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    
    // Email format validation (only if provided)
    if (formData.email?.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateForm()) return;
    setIsSubmitting(true);
    try {
      updatePatient(params.id as string, formData);
      router.push(`/patient/${params.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <Link
            href={`/patient/${params.id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-[20px] shadow-lg shadow-blue-100">
              <UserRoundPen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Patient</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <h2 className="text-lg font-black tracking-tight">Identity</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Basic identity and contact details for the patient record.</p>
          </div>
          <div className="md:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField label="First Name" value={formData.firstName} onChange={v => updateField('firstName', v)} required error={errors.firstName} />
              <FormField label="Last Name" value={formData.lastName} onChange={v => updateField('lastName', v)} required error={errors.lastName} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Date of Birth" type="date" value={formData.dateOfBirth || ''} onChange={v => updateField('dateOfBirth', v)} error={errors.dateOfBirth} />
              <SelectField label="Gender" value={formData.gender || ''} onChange={v => updateField('gender', v)} options={[{v:'male',l:'Male'},{v:'female',l:'Female'},{v:'other',l:'Other'}].map(o=>({value:o.v,label:o.l}))} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Phone" value={formData.phone || ''} onChange={v => updateField('phone', v)} placeholder="(555) 000-0000" error={errors.phone} />
              <FormField label="Email" type="email" value={formData.email || ''} onChange={v => updateField('email', v)} placeholder="name@example.com" error={errors.email} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <MapPin className="h-5 w-5" />
              <h2 className="text-lg font-black tracking-tight">Location</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Residential address for billing and correspondence.</p>
          </div>
          <div className="md:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <FormField label="Street Address" value={formData.address?.street || ''} onChange={v => updateField('address.street', v)} error={errors['address.street']} />
            <div className="grid grid-cols-3 gap-4">
              <FormField label="City" value={formData.address?.city || ''} onChange={v => updateField('address.city', v)} error={errors['address.city']} />
              <FormField label="State" value={formData.address?.state || ''} onChange={v => updateField('address.state', v)} placeholder="NY" error={errors['address.state']} />
              <FormField label="ZIP" value={formData.address?.zipCode || ''} onChange={v => updateField('address.zipCode', v)} placeholder="10001" error={errors['address.zipCode']} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="text-lg font-black tracking-tight">Safety</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Emergency contacts and critical safety information.</p>
          </div>
          <div className="md:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Contact Name" value={formData.emergencyContact?.name || ''} onChange={v => updateField('emergencyContact.name', v)} error={errors['emergencyContact.name']} />
              <FormField label="Relationship" value={formData.emergencyContact?.relationship || ''} onChange={v => updateField('emergencyContact.relationship', v)} placeholder="Parent, Spouse..." error={errors['emergencyContact.relationship']} />
            </div>
            <FormField label="Emergency Phone" value={formData.emergencyContact?.phone || ''} onChange={v => updateField('emergencyContact.phone', v)} error={errors['emergencyContact.phone']} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Stethoscope className="h-5 w-5" />
              <h2 className="text-lg font-black tracking-tight">Clinical</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Medical background and insurance details.</p>
          </div>
          <div className="md:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <SelectField label="Blood Type" value={formData.medicalInfo.bloodType || ''} onChange={v => updateField('medicalInfo.bloodType', v)} options={['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t=>({value:t,label:t}))} />
              <FormField label="Insurance" value={formData.medicalInfo.insuranceProvider || ''} onChange={v => updateField('medicalInfo.insuranceProvider', v)} placeholder="Provider Name" />
            </div>
            
            <ArrayField label="Allergies" values={formData.medicalInfo.allergies} onChange={v => updateField('medicalInfo.allergies', v)} placeholder="e.g. Penicillin" />
            <ArrayField label="Current Medications" values={formData.medicalInfo.currentMedications} onChange={v => updateField('medicalInfo.currentMedications', v)} placeholder="e.g. Advil 200mg" />
            <ArrayField label="Chronic Conditions" values={formData.medicalInfo.chronicConditions} onChange={v => updateField('medicalInfo.chronicConditions', v)} placeholder="e.g. Asthma" />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-10 border-t border-slate-200">
          <Link
            href={`/patient/${params.id}`}
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
            {isSubmitting ? 'Updating...' : 'Update Patient Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

