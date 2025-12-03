import Dexie, { Table } from 'dexie';
import { PatientData, Message } from '../types/consultation';

export interface ConsultationRecord {
  id?: number;
  patientData: PatientData;
  messages: Message[];
  createdAt: Date;
  completedAt?: Date;
  soapNote?: string;
}

export interface HealthRecord {
  id?: number;
  type: 'prescription' | 'report' | 'visit' | 'vaccination';
  title: string;
  date: string;
  doctor?: string;
  hospital?: string;
  notes: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  id?: number;
  bloodGroup: string;
  height: string;
  weight: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  updatedAt: Date;
}

export interface Appointment {
  id?: number;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  specialty: string;
  doctor?: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

class ConsultationDatabase extends Dexie {
  consultations!: Table<ConsultationRecord>;
  healthRecords!: Table<HealthRecord>;
  personalInfo!: Table<PersonalInfo>;
  appointments!: Table<Appointment>;

  constructor() {
    super('SwaasthmitraDB');
    
    this.version(1).stores({
      consultations: '++id, createdAt, completedAt'
    });

    this.version(2).stores({
      consultations: '++id, createdAt, completedAt',
      healthRecords: '++id, date, type',
      personalInfo: '++id'
    });

    this.version(3).stores({
      consultations: '++id, createdAt, completedAt',
      healthRecords: '++id, date, type',
      personalInfo: '++id',
      appointments: '++id, date, status, createdAt'
    });
  }
}

export const db = new ConsultationDatabase();

export const saveConsultation = async (consultation: Omit<ConsultationRecord, 'id'>) => {
  return await db.consultations.add(consultation);
};

export const getConsultations = async () => {
  return await db.consultations.toArray();
};

export const getConsultationById = async (id: number) => {
  return await db.consultations.get(id);
};

export const deleteConsultation = async (id: number) => {
  return await db.consultations.delete(id);
};
