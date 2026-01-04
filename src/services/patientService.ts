import { Patient } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PATIENTS_STORAGE_KEY = 'patient-management-patients';

export function usePatients() {
  const [patients, setPatients] = useLocalStorage<Patient[]>(PATIENTS_STORAGE_KEY, mockPatients);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt'>>) => {
    setPatients(prev => prev.map(patient =>
      patient.id === id
        ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
        : patient
    ));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
  };

  const searchPatients = (query: string): Patient[] => {
    if (!query.trim()) return patients;

    const lowerQuery = query.toLowerCase();
    return patients.filter(patient =>
      patient.firstName.toLowerCase().includes(lowerQuery) ||
      patient.lastName.toLowerCase().includes(lowerQuery) ||
      patient.email.toLowerCase().includes(lowerQuery) ||
      patient.phone.includes(query) ||
      patient.dateOfBirth.includes(query)
    );
  };

  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    searchPatients,
  };
}
