export interface MedicalRecord {
  id: string;
  date: string;
  type: 'visit' | 'diagnosis' | 'treatment' | 'prescription' | 'test';
  description: string;
  notes?: string;
  doctor?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalInfo: {
    bloodType?: string;
    allergies: string[];
    currentMedications: string[];
    chronicConditions: string[];
    insuranceProvider?: string;
    insuranceId?: string;
  };
  medicalHistory: MedicalRecord[];
  createdAt: string;
  updatedAt: string;
}
