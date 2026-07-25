import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function RegisterForm({ onSubmit, isLoading, authError }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="space-y-4" onSubmit={(e) => onSubmit(e, name, email, password)}>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#f0f6fc] placeholder-[#848d96] focus:border-[#58a6ff] outline-none"
            placeholder="Alex Learner"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1">Email address</label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#f0f6fc] placeholder-[#848d96] focus:border-[#58a6ff] outline-none"
            placeholder="student@example.com"
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

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-[rgba(240,246,252,0.1)] text-xs font-bold uppercase tracking-wider rounded-md text-white bg-[#238636] hover:bg-[#2ea043] focus:outline-none disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
        </button>
      </div>
    </form>
  );
}


