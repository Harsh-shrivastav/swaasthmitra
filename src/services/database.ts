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

class ConsultationDatabase extends Dexie {
  consultations!: Table<ConsultationRecord>;

  constructor() {
    super('SwaasthmitraDB');
    
    this.version(1).stores({
      consultations: '++id, createdAt, completedAt'
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
