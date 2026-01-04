import { useCallback } from 'react';
import { Patient, MedicalRecord } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PATIENTS_STORAGE_KEY = 'patient-management-patients';

export function usePatients() {
  const [patients, setPatients] = useLocalStorage<Patient[]>(PATIENTS_STORAGE_KEY, mockPatients);

  const addPatient = useCallback((patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  }, [setPatients]);

  const updatePatient = useCallback((id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt'>>) => {
    setPatients(prev => prev.map(patient =>
      patient.id === id
        ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
        : patient
    ));
  }, [setPatients]);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  }, [setPatients]);

  const getPatientById = useCallback((id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
  }, [patients]);

  const searchPatients = useCallback((query: string): Patient[] => {
    if (!query.trim()) return patients;

    const lowerQuery = query.toLowerCase();
    return patients.filter(patient =>
      patient.firstName.toLowerCase().includes(lowerQuery) ||
      patient.lastName.toLowerCase().includes(lowerQuery) ||
      patient.email.toLowerCase().includes(lowerQuery) ||
      patient.phone?.includes(query) ||
      patient.dateOfBirth?.includes(query)
    );
  }, [patients]);

  const addMedicalRecord = useCallback((patientId: string, recordData: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: Date.now().toString(),
    };

    setPatients(prev => prev.map(patient =>
      patient.id === patientId
        ? { 
            ...patient, 
            medicalHistory: [newRecord, ...patient.medicalHistory],
            updatedAt: new Date().toISOString() 
          }
        : patient
    ));
    return newRecord;
  }, [setPatients]);

  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    searchPatients,
    addMedicalRecord,
  };
}
