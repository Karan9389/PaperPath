import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function RegisterForm({ onSubmit, isLoading, authError }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.02em',
    marginBottom: '6px',
    marginLeft: '2px',
    color: 'var(--text-secondary)',
  };

  return (
    <form className="space-y-5" onSubmit={(e) => onSubmit(e, name, email, password)}>
      <div className="space-y-4">
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            required
            className="input-glass w-full px-4 py-3 rounded-[14px] text-[15px] transition-all"
            placeholder="Alex Learner"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            required
            className="input-glass w-full px-4 py-3 rounded-[14px] text-[15px] transition-all"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            className="input-glass w-full px-4 py-3 rounded-[14px] text-[15px] transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {authError && (
        <div
          className="p-3 rounded-[14px] text-[13px] font-medium flex items-center justify-center text-center"
          style={{
            background: 'rgba(255,69,58,0.10)',
            border: '1px solid rgba(255,69,58,0.25)',
            color: 'var(--accent-red)',
          }}
        >
          {authError}
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center py-3.5 px-4 text-[15px]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
