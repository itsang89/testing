import { Patient } from '@/types/patient';

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    phone: '(555) 123-4567',
    email: 'john.doe@email.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 987-6543'
    },
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      currentMedications: ['Lisinopril 10mg', 'Metformin 500mg'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      insuranceProvider: 'Blue Cross Blue Shield',
      insuranceId: 'BCBS123456'
    },
    medicalHistory: [
      {
        id: 'h1',
        date: '2024-01-15',
        type: 'visit',
        description: 'Annual physical examination',
        notes: 'Blood pressure: 140/90, BMI: 28.5',
        doctor: 'Dr. Smith'
      },
      {
        id: 'h2',
        date: '2024-01-10',
        type: 'diagnosis',
        description: 'Hypertension diagnosis',
        notes: 'Prescribed Lisinopril',
        doctor: 'Dr. Smith'
      },
      {
        id: 'h3',
        date: '2023-11-20',
        type: 'prescription',
        description: 'Metformin prescription',
        notes: 'For diabetes management',
        doctor: 'Dr. Johnson'
      }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1990-07-22',
    gender: 'female',
    phone: '(555) 234-5678',
    email: 'sarah.johnson@email.com',
    address: {
      street: '456 Oak Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Husband',
      phone: '(555) 876-5432'
    },
    medicalInfo: {
      bloodType: 'A-',
      allergies: ['Latex'],
      currentMedications: ['Synthroid 50mcg'],
      chronicConditions: ['Hypothyroidism'],
      insuranceProvider: 'Aetna',
      insuranceId: 'AET789012'
    },
    medicalHistory: [
      {
        id: 'h4',
        date: '2024-02-01',
        type: 'visit',
        description: 'Thyroid function check',
        notes: 'TSH levels normal, medication adjustment made',
        doctor: 'Dr. Davis'
      },
      {
        id: 'h5',
        date: '2023-08-15',
        type: 'diagnosis',
        description: 'Hypothyroidism diagnosis',
        notes: 'Started Synthroid therapy',
        doctor: 'Dr. Davis'
      }
    ],
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Williams',
    dateOfBirth: '1972-11-08',
    gender: 'male',
    phone: '(555) 345-6789',
    email: 'robert.williams@email.com',
    address: {
      street: '789 Pine Street',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501'
    },
    emergencyContact: {
      name: 'Linda Williams',
      relationship: 'Wife',
      phone: '(555) 765-4321'
    },
    medicalInfo: {
      bloodType: 'B+',
      allergies: [],
      currentMedications: ['Atorvastatin 20mg', 'Aspirin 81mg'],
      chronicConditions: ['High Cholesterol', 'Coronary Artery Disease'],
      insuranceProvider: 'United Healthcare',
      insuranceId: 'UHC345678'
    },
    medicalHistory: [
      {
        id: 'h6',
        date: '2024-01-20',
        type: 'visit',
        description: 'Cardiology follow-up',
        notes: 'Cholesterol levels improved, continue current regimen',
        doctor: 'Dr. Chen'
      },
      {
        id: 'h7',
        date: '2023-12-01',
        type: 'test',
        description: 'Lipid panel',
        notes: 'Total cholesterol: 180, LDL: 95, HDL: 45',
        doctor: 'Dr. Chen'
      },
      {
        id: 'h8',
        date: '2023-06-15',
        type: 'diagnosis',
        description: 'Coronary artery disease diagnosis',
        notes: 'Mild blockage detected, medication therapy initiated',
        doctor: 'Dr. Chen'
      }
    ],
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    dateOfBirth: '1995-04-12',
    gender: 'female',
    phone: '(555) 456-7890',
    email: 'emily.brown@email.com',
    address: {
      street: '321 Elm Drive',
      city: 'Madison',
      state: 'WI',
      zipCode: '53703'
    },
    emergencyContact: {
      name: 'David Brown',
      relationship: 'Brother',
      phone: '(555) 654-3210'
    },
    medicalInfo: {
      bloodType: 'AB+',
      allergies: ['Sulfa drugs'],
      currentMedications: ['Albuterol inhaler'],
      chronicConditions: ['Asthma'],
      insuranceProvider: 'Humana',
      insuranceId: 'HUM901234'
    },
    medicalHistory: [
      {
        id: 'h9',
        date: '2024-01-08',
        type: 'visit',
        description: 'Asthma management review',
        notes: 'Peak flow measurements within normal range',
        doctor: 'Dr. Rodriguez'
      },
      {
        id: 'h10',
        date: '2023-09-20',
        type: 'diagnosis',
        description: 'Asthma diagnosis',
        notes: 'Allergic asthma, prescribed inhaler',
        doctor: 'Dr. Rodriguez'
      }
    ],
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  }
];
