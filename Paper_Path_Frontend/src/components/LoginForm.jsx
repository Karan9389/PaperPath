import React, { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

export default function LoginForm({ onSubmit, isLoading, authError }) {
  const [email, setEmail] = useState('demo@paperpath.com');
  const [password, setPassword] = useState('demo1234');

  const fillDemo = () => {
    setEmail('demo@paperpath.com');
    setPassword('demo1234');
  };

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
    <form className="space-y-5" onSubmit={(e) => onSubmit(e, email, password)}>
      <div className="space-y-4">
        <div>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            required
            className="input-glass w-full px-4 py-3 rounded-[14px] text-[15px] transition-all"
            placeholder="demo@paperpath.com"
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

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center py-3.5 px-4 text-[15px]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={fillDemo}
          className="w-full flex items-center justify-center py-3 px-4 text-[13px] font-semibold rounded-[14px] transition-all duration-200 hover:opacity-80"
          style={{
            color: 'var(--accent-blue)',
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Zap className="h-4 w-4 mr-1.5" style={{ color: 'var(--accent-orange)' }} />
          Quick Demo Credentials
        </button>
      </div>
    </form>
  );
}
