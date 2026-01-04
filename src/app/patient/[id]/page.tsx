'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePatients } from '@/services/patientService';
import { MedicalRecord } from '@/types/patient';
import { 
  ChevronLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  ShieldAlert, 
  Pill, 
  Activity,
  Calendar,
  User,
  ExternalLink,
  Plus,
  ArrowLeft,
  Search,
  FileText,
  FlaskConical,
  ClipboardList,
  Microscope,
  Stethoscope
} from 'lucide-react';

function MedicalHistoryTimeline({ records }: { records: MedicalRecord[] }) {
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getRecordIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'visit':
        return <Stethoscope className="h-5 w-5" />;
      case 'diagnosis':
        return <Search className="h-5 w-5" />;
      case 'treatment':
        return <Heart className="h-5 w-5" />;
      case 'prescription':
        return <Pill className="h-5 w-5" />;
      case 'test':
        return <FlaskConical className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getRecordColor = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'visit':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'diagnosis':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'treatment':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'prescription':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'test':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {sortedRecords.map((record) => (
        <div key={record.id} className="relative flex items-start gap-6 group">
          <div className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-xl border shadow-sm transition-all group-hover:scale-110 ${getRecordColor(record.type)}`}>
            {getRecordIcon(record.type)}
          </div>
          
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">{record.description}</h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(record.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <span className={`self-start px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${getRecordColor(record.type)}`}>
                {record.type}
              </span>
            </div>
            
            <div className="space-y-4">
              {record.doctor && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 font-medium">Practitioner:</span>
                  <span className="text-slate-900 font-semibold">{record.doctor}</span>
                </div>
              )}
              {record.notes && (
                <div className="bg-slate-50/50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed border border-slate-100/50 italic">
                  "{record.notes}"
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PatientDetail() {
  const params = useParams();
  const router = useRouter();
  const { getPatientById } = usePatients();

  const patient = params.id ? getPatientById(params.id as string) : null;

  if (!patient) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
          <Search className="h-12 w-12 text-slate-300" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Patient Records Missing</h3>
        <p className="text-slate-500 mb-8 max-w-sm text-center font-medium">
          We couldn't locate any records matching ID: <span className="text-slate-900 font-mono">{params.id}</span>
        </p>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return 'N/A';
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors"
        >
          <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </div>
          Back to list
        </button>
        <div className="flex items-center gap-3">
          <Link
            href={`/patient/${patient.id}/edit`}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            <FileText className="h-4 w-4" />
            Edit Profile
          </Link>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
            <ExternalLink className="h-4 w-4" />
            Export Data
          </button>
          <Link
            href={`/patient/${patient.id}/record/add`}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-100"
          >
            <Plus className="h-4 w-4" />
            New Record
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-100">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Active Patient
                </span>
              </div>
              <p className="text-slate-500 font-bold flex items-center gap-2">
                {patient.gender} • {getAge(patient.dateOfBirth)} Years Old • <span className="font-mono text-slate-400">ID: {patient.id.slice(0, 8)}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">{patient.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">{patient.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">
                  {patient.address?.city && patient.address?.state 
                    ? `${patient.address.city}, ${patient.address.state}` 
                    : (patient.address?.city || patient.address?.state || 'N/A')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Vitals Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-rose-50 rounded-lg">
                  <Heart className="h-4 w-4 text-rose-500" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</span>
              </div>
              <p className="text-2xl font-black text-slate-900">{patient.medicalInfo.bloodType || 'N/A'}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Activity className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height</span>
              </div>
              <p className="text-2xl font-black text-slate-900">178 <span className="text-xs text-slate-400">cm</span></p>
            </div>
          </div>

          {/* Critical Info */}
          <div className="bg-rose-50/50 rounded-3xl border border-rose-100/50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <h2 className="text-sm font-black text-rose-900 uppercase tracking-wider">Allergies & Alerts</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.medicalInfo.allergies.length > 0 ? (
                patient.medicalInfo.allergies.map((allergy, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white text-rose-600 border border-rose-100 rounded-xl text-xs font-bold">
                    {allergy}
                  </span>
                ))
              ) : (
                <p className="text-rose-600/60 text-xs font-bold italic">No allergies reported</p>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Pill className="h-5 w-5 text-purple-500" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Current Medications</h2>
            </div>
            <div className="space-y-3">
              {patient.medicalInfo.currentMedications.length > 0 ? (
                patient.medicalInfo.currentMedications.map((med, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">{med}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm font-medium italic py-4 text-center">No active prescriptions</p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-slate-400" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Emergency Contact</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-black">{patient.emergencyContact?.name || 'No Contact'}</p>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mt-1">{patient.emergencyContact?.relationship || 'N/A'}</p>
              </div>
              {patient.emergencyContact?.phone && (
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10">
                  <Phone className="h-4 w-4" />
                  {patient.emergencyContact.phone}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-2xl">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Clinical History</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                Total Events: {patient.medicalHistory.length}
              </div>
            </div>

            {patient.medicalHistory.length > 0 ? (
              <MedicalHistoryTimeline records={patient.medicalHistory} />
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FileText className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Clinical Records Found</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                  Start by adding the first medical event to build this patient's history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
