'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePatients } from '@/services/patientService';
import { Patient } from '@/types/patient';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Droplets, 
  Stethoscope,
  ChevronRight,
  Calendar,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

function PatientCard({ patient }: { patient: Patient }) {
  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {patient.gender} • {getAge(patient.dateOfBirth)} years
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2.5 text-[13px] text-gray-600">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-gray-600">
          <Mail className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{patient.email}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Droplets className="h-3 w-3 text-red-500" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Blood</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">{patient.medicalInfo.bloodType || 'N/A'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Stethoscope className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Status</span>
            </div>
            <p className="text-sm font-semibold text-gray-700 truncate">
              {patient.medicalInfo.chronicConditions[0] || 'Healthy'}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/patient/${patient.id}`}
        className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
      >
        View Profile
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { patients, searchPatients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilteredPatients(searchPatients(query));
    } else {
      setFilteredPatients(patients);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-2">
            <Users className="h-4 w-4" />
            <span>Patient Management</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Overview of your medical practice and patient records.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <Link
            href="/add"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 font-semibold text-sm"
          >
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Link>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: patients.length, color: 'blue' },
          { label: 'Recently Added', value: '3', color: 'green' },
          { label: 'Pending Visits', value: '12', color: 'orange' },
          { label: 'Critical Care', value: '2', color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search patients by name, email, or records..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Patient Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Patient Directory</h2>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {filteredPatients.length} Results
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No matches found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              {searchQuery ? `We couldn't find any patients matching "${searchQuery}"` : 'Your patient list is currently empty.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
