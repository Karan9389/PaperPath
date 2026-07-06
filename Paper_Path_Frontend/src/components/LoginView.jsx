import React from 'react';
import { BrainCircuit } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginView({ onLogin, onRegister, isLoading, authMode, setAuthMode, authError }) {
  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BrainCircuit className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Welcome to PaperPath
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Research papers made easy for beginners.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isLogin ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${!isLogin ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <LoginForm onSubmit={onLogin} isLoading={isLoading} authError={authError} />
        ) : (
          <RegisterForm onSubmit={onRegister} isLoading={isLoading} authError={authError} />
        )}
      </div>
    </div>
  );
}
