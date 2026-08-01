import React, { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

export default function LoginForm({ onSubmit, isLoading, authError }) {
  const [email, setEmail] = useState('demo@paperpath.com');
  const [password, setPassword] = useState('demo1234');

  const fillDemo = () => {
    setEmail('demo@paperpath.com');
    setPassword('demo1234');
  };

  return (
    <form className="space-y-5" onSubmit={(e) => onSubmit(e, email, password)}>
      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 ml-1">Username or email address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-xl text-[15px] text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-blue)] outline-none transition-colors shadow-inner"
            placeholder="demo@paperpath.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 ml-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-xl text-[15px] text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-blue)] outline-none transition-colors shadow-inner"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {authError && (
        <div className="p-3 rounded-xl border border-[rgba(255,69,58,0.3)] bg-[rgba(255,69,58,0.1)] text-[13px] font-medium text-[var(--accent-red)] flex items-center justify-center text-center">
          {authError}
        </div>
      )}

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3.5 px-4 rounded-xl text-[15px] font-bold text-white bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-bright)] focus:outline-none disabled:opacity-50 transition-colors shadow-md"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={fillDemo}
          className="w-full flex items-center justify-center py-3 px-4 text-[13px] font-semibold rounded-xl text-[var(--accent-blue)] bg-[var(--bg-overlay)] border border-[var(--border-subtle)] hover:border-[var(--border-muted)] hover:bg-[var(--bg-raised)] transition-all"
        >
          <Zap className="h-4 w-4 mr-1.5 text-[var(--accent-orange)]" /> Quick Demo Credentials
        </button>
      </div>
    </form>
  );
}
