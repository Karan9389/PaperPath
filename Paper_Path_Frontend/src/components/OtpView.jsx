import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, ShieldCheck, RefreshCw, Mail } from 'lucide-react';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

export default function OtpView({ email, onSuccess, onResend, isLoading, error }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [expiryLeft, setExpiryLeft] = useState(OTP_EXPIRY_SECONDS);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (expiryLeft <= 0) return;
    const t = setInterval(() => setExpiryLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [error]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = useCallback((index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === OTP_LENGTH - 1) {
      const code = next.join('');
      if (code.length === OTP_LENGTH) onSuccess(code);
    }
  }, [digits, onSuccess]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastFilled]?.focus();
    if (pasted.length === OTP_LENGTH) onSuccess(pasted);
  }, [onSuccess]);

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setDigits(Array(OTP_LENGTH).fill(''));
    setResendCooldown(RESEND_COOLDOWN);
    setExpiryLeft(OTP_EXPIRY_SECONDS);
    inputRefs.current[0]?.focus();
    onResend();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length === OTP_LENGTH) onSuccess(code);
  };

  const isExpired = expiryLeft === 0;
  const filled = digits.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-base)]">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-[rgba(48,209,88,0.15)] border border-[rgba(48,209,88,0.3)] rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            <ShieldCheck className="h-8 w-8 text-[var(--accent-green)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">We sent a 6-digit code to</p>
            <p className="text-[14px] font-semibold text-[var(--accent-blue)] mt-1 flex items-center justify-center gap-1.5">
              <Mail size={16} /> {email}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-[32px] p-8 space-y-8">
          {/* Expiry timer */}
          <div className="text-center">
            {isExpired ? (
              <span className="text-[13px] font-semibold text-[var(--accent-red)]">
                ⚠ Code expired — please resend
              </span>
            ) : (
              <span className="text-[13px] text-[var(--text-secondary)]">
                Code expires in{' '}
                <span className={`font-bold font-mono ${expiryLeft < 60 ? 'text-[var(--accent-orange)]' : 'text-[var(--accent-green)]'}`}>
                  {formatTime(expiryLeft)}
                </span>
              </span>
            )}
          </div>

          {/* OTP Input Boxes */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`flex gap-2 justify-center ${shake ? 'animate-shake' : ''}`}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  disabled={isLoading || isExpired}
                  className={`w-12 h-14 text-center text-2xl font-bold font-mono rounded-xl outline-none transition-all ${
                    digit ? 'bg-[rgba(10,132,255,0.15)] text-white border-2 border-[var(--accent-blue)] shadow-[0_0_0_4px_rgba(10,132,255,0.15)]' : 'bg-[var(--bg-overlay)] text-white border border-[var(--border-subtle)]'
                  } focus:border-[var(--accent-blue)] focus:bg-[rgba(10,132,255,0.1)]`}
                  style={{
                    borderColor: error ? 'var(--accent-red)' : undefined
                  }}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-[13px] text-[var(--accent-red)] mt-3 p-2 bg-[rgba(255,69,58,0.1)] border border-[rgba(255,69,58,0.3)] rounded-xl font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || filled < OTP_LENGTH || isExpired}
              className={`w-full py-4 rounded-xl text-[15px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                filled === OTP_LENGTH && !isExpired && !isLoading
                  ? 'bg-[var(--accent-green)] hover:bg-[#32d75f] text-white shadow-md'
                  : 'bg-[rgba(48,209,88,0.2)] text-[var(--text-secondary)] cursor-not-allowed'
              }`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
              {isLoading ? 'Verifying…' : 'Verify Code'}
            </button>
          </form>

          {/* Resend row */}
          <div className="text-center pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-[13px] text-[var(--text-secondary)] mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                resendCooldown > 0 || isLoading
                  ? 'text-[var(--text-muted)] cursor-not-allowed'
                  : 'text-[var(--accent-blue)] hover:bg-[var(--bg-raised)] cursor-pointer'
              }`}
            >
              <RefreshCw size={14} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-[var(--text-secondary)]">
          Wrong email?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="text-[var(--text-primary)] hover:underline font-medium">
            Go back
          </a>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
