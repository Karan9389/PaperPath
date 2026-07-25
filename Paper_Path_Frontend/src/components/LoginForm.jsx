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
    <form className="space-y-4" onSubmit={(e) => onSubmit(e, email, password)}>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1">Username or email address</label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#f0f6fc] placeholder-[#848d96] focus:border-[#58a6ff] outline-none"
            placeholder="demo@paperpath.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#f0f6fc] placeholder-[#848d96] focus:border-[#58a6ff] outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {authError ? (
        <p className="p-2.5 rounded-md border border-[#da3633]/40 bg-[#da3633]/10 text-xs font-medium text-[#f85149]">
          {authError}
        </p>
      ) : null}

      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-[rgba(240,246,252,0.1)] text-xs font-bold uppercase tracking-wider rounded-md text-white bg-[#238636] hover:bg-[#2ea043] focus:outline-none disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={fillDemo}
          className="w-full flex items-center justify-center py-2 px-4 text-xs font-semibold rounded-md text-[#58a6ff] bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] transition-colors"
        >
          <Zap className="h-3.5 w-3.5 mr-1 text-[#3fb950]" /> Quick Demo Credentials
        </button>
      </div>
    </form>
  );
}


