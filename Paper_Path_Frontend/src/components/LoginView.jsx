import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginView({ onLogin, onRegister, isLoading, authMode, setAuthMode, authError }) {
  const isLogin = authMode === 'login';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(64,156,255,0.14) 0%, transparent 65%)',
          filter: 'blur(32px)',
        }}
      />
      <div
        className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(191,90,242,0.12) 0%, transparent 65%)',
          filter: 'blur(32px)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(48,209,88,0.05) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="max-w-md w-full space-y-7 relative">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Logo icon */}
          <div
            className="mx-auto h-16 w-16 rounded-[22px] flex items-center justify-center shadow-xl transition-transform duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(140deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
              boxShadow: '0 16px 40px -8px rgba(64,156,255,0.45)',
            }}
          >
            <BrainCircuit className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-1.5">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              PaperPath{' '}
              <span style={{ color: 'var(--accent-blue)' }}>AI</span>
            </h1>
            <p className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              Your intelligent research companion
            </p>
          </div>
        </div>

        {/* Glass Card */}
        <div
          className="glass-card rounded-[28px] p-7 space-y-6"
          style={{ cursor: 'default' }}
        >
          {/* Mode switcher */}
          <div
            className="flex p-1 rounded-full"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { key: 'login',    label: 'Sign In' },
              { key: 'register', label: 'Create Account' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setAuthMode(key)}
                className="flex-1 text-[13px] font-bold py-2 rounded-full transition-all duration-250"
                style={
                  authMode === key
                    ? {
                        background: 'var(--tab-active-bg)',
                        color: 'var(--tab-active-text)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                        transform: 'scale(1.02)',
                      }
                    : { color: 'var(--text-secondary)' }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          {isLogin ? (
            <LoginForm onSubmit={onLogin} isLoading={isLoading} authError={authError} />
          ) : (
            <RegisterForm onSubmit={onRegister} isLoading={isLoading} authError={authError} />
          )}
        </div>

        {/* Footer badge */}
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: 'var(--bg-overlay)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Sparkles className="h-3 w-3" style={{ color: 'var(--accent-blue)' }} />
            Powered by Gemini AI
          </span>
        </div>
      </div>
    </div>
  );
}
