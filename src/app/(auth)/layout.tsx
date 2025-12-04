import { ReactNode } from 'react';
import { AuthProvider } from '@/context/authcontext';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </AuthProvider>
  );
}
