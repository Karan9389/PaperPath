import React from 'react';
import { BrainCircuit } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginView({ onLogin, onRegister, isLoading, authMode, setAuthMode, authError }) {
  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-base)]">
      <div className="max-w-md w-full space-y-8">
        {/* Apple Style Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            <BrainCircuit className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sign in to PaperPath <span className="text-[var(--accent-blue)]">AI</span>
          </h2>
        </div>

        {/* Glass Card Container */}
        <div className="glass-card rounded-[32px] p-8 space-y-8">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-full">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 text-[13px] font-bold py-2 rounded-full transition-all duration-300 ${
                isLogin ? 'bg-[var(--bg-raised)] text-white shadow-md scale-[1.02]' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 text-[13px] font-bold py-2 rounded-full transition-all duration-300 ${
                !isLogin ? 'bg-[var(--bg-raised)] text-white shadow-md scale-[1.02]' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {isLogin ? (
            <LoginForm onSubmit={onLogin} isLoading={isLoading} authError={authError} />
          ) : (
            <RegisterForm onSubmit={onRegister} isLoading={isLoading} authError={authError} />
          )}
        </div>
      </div>
    </div>
  );
}
