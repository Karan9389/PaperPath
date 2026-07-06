import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function RegisterForm({ onSubmit, isLoading, authError }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="mt-8 space-y-6" onSubmit={(e) => onSubmit(e, name, email, password)}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
          <input
            type="text"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
            placeholder="Alex Learner"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
          <input
            type="email"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {authError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{authError}</p> : null}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
