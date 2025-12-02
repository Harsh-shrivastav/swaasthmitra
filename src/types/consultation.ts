// Type definitions for the medical consultation system

export interface PatientData {
  demographics: {
    age?: string;
    gender?: string;
  };
  chiefComplaint?: string;
  symptoms: Record<string, any>;
  history: {
    pastConditions?: string[];
    medications?: string;
    allergies?: string;
    smoking?: string;
    alcohol?: string;
  };
  answers: Record<string, any>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  questionId?: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'choice' | 'multiple' | 'text' | 'number';
  options?: string[];
  placeholder?: string;
  required: boolean;
}

export interface ConsultationState {
  currentStep: 'welcome' | 'demographics' | 'chiefComplaint' | 'dynamicQuestioning' | 'medicalHistory' | 'socialHistory' | 'assessment' | 'complete';
  currentQuestionIndex: number;
  patientData: PatientData;
  conversationHistory: Message[];
  isInProgress: boolean;
  dynamicQuestionCount: number;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  redFlags?: string[];
}
