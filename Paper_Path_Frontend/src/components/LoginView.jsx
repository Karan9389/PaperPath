import React from 'react';
import { BrainCircuit, Lock } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginView({ onLogin, onRegister, isLoading, authMode, setAuthMode, authError }) {
  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0d1117]">
      <div className="max-w-md w-full space-y-6">
        {/* GitHub Style Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-[#21262d] border border-[#30363d] rounded-full flex items-center justify-center">
            <BrainCircuit className="h-6 w-6 text-[#3fb950]" />
          </div>
          <h2 className="text-xl font-bold text-[#f0f6fc] tracking-tight">
            Sign in to PaperPath <span className="text-[#3fb950]">AI</span>
          </h2>
        </div>

        {/* GitHub Dark Card Container */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-6 shadow-xl">
          {/* Mode Switcher */}
          <div className="flex border-b border-[#30363d] pb-3 space-x-4">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                isLogin ? 'border-[#f78166] text-[#f0f6fc]' : 'border-transparent text-[#848d96] hover:text-[#c9d1d9]'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
                !isLogin ? 'border-[#f78166] text-[#f0f6fc]' : 'border-transparent text-[#848d96] hover:text-[#c9d1d9]'
              }`}
            >
              Create account
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


