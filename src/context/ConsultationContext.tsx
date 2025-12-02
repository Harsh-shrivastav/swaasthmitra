import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConsultationState, PatientData, Message } from '../types/consultation';

interface ConsultationContextType {
  consultation: ConsultationState;
  updateConsultation: (updates: Partial<ConsultationState>) => void;
  addMessage: (message: Message) => void;
  updatePatientData: (data: Partial<PatientData>) => void;
  resetConsultation: () => void;
}

const initialState: ConsultationState = {
  currentStep: 'welcome',
  currentQuestionIndex: 0,
  patientData: {
    demographics: {},
    symptoms: {},
    history: {},
    answers: {},
  },
  conversationHistory: [],
  isInProgress: false,
  dynamicQuestionCount: 0,
};

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consultation, setConsultation] = useState<ConsultationState>(initialState);

  const updateConsultation = (updates: Partial<ConsultationState>) => {
    setConsultation(prev => ({ ...prev, ...updates }));
  };

  const addMessage = (message: Message) => {
    setConsultation(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, message],
    }));
  };

  const updatePatientData = (data: Partial<PatientData>) => {
    setConsultation(prev => ({
      ...prev,
      patientData: { ...prev.patientData, ...data },
    }));
  };

  const resetConsultation = () => {
    setConsultation(initialState);
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultation,
        updateConsultation,
        addMessage,
        updatePatientData,
        resetConsultation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultation must be used within ConsultationProvider');
  }
  return context;
};
