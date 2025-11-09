'use client';

import { createContext, useContext, ReactNode } from 'react';

interface RegistrationContextType {
  globalRegistrationEnabled: boolean;
  registrationStartTime: string | null;
  registrationDeadline: string | null;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export function RegistrationProvider({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value: RegistrationContextType;
}) {
  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}
