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

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // OTP expiry ticker
  useEffect(() => {
    if (expiryLeft <= 0) return;
    const t = setInterval(() => setExpiryLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Shake on error
  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [error]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = useCallback((index, value) => {
    // Accept only a single digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: '#0d1117',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            background: 'rgba(88,166,255,0.1)',
            border: '1px solid rgba(88,166,255,0.3)',
            borderRadius: '50%',
            marginBottom: '16px',
          }}>
            <ShieldCheck size={26} color="#58a6ff" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f6fc', margin: '0 0 8px' }}>
            Check your email
          </h1>
          <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>
            We sent a 6-digit code to
          </p>
          <p style={{ fontSize: '13px', color: '#58a6ff', fontWeight: 600, margin: '4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Mail size={14} /> {email}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '12px',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>

          {/* Expiry timer */}
          <div style={{ textAlign: 'center' }}>
            {isExpired ? (
              <span style={{ fontSize: '12px', color: '#f85149', fontWeight: 600 }}>
                ⚠ Code expired — please resend
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: '#8b949e' }}>
                Code expires in{' '}
                <span style={{ color: expiryLeft < 60 ? '#e3b341' : '#3fb950', fontWeight: 700, fontFamily: 'monospace' }}>
                  {formatTime(expiryLeft)}
                </span>
              </span>
            )}
          </div>

          {/* OTP Input Boxes */}
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97)' : 'none',
            }}>
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
                  style={{
                    width: '44px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    background: digit ? 'rgba(88,166,255,0.08)' : '#0d1117',
                    border: error
                      ? '2px solid rgba(248,81,73,0.7)'
                      : digit
                      ? '2px solid rgba(88,166,255,0.6)'
                      : '2px solid #30363d',
                    borderRadius: '8px',
                    color: '#f0f6fc',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    caretColor: '#58a6ff',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#58a6ff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(88,166,255,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = digit ? 'rgba(88,166,255,0.6)' : '#30363d';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#f85149',
                margin: '12px 0 0',
                padding: '8px 12px',
                background: 'rgba(248,81,73,0.08)',
                borderRadius: '6px',
                border: '1px solid rgba(248,81,73,0.2)',
              }}>
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || filled < OTP_LENGTH || isExpired}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '11px',
                background: filled === OTP_LENGTH && !isExpired ? '#238636' : 'rgba(35,134,54,0.3)',
                color: '#fff',
                border: '1px solid rgba(240,246,252,0.1)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: filled === OTP_LENGTH && !isExpired && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { if (filled === OTP_LENGTH && !isExpired) e.target.style.background = '#2ea043'; }}
              onMouseLeave={(e) => { if (filled === OTP_LENGTH && !isExpired) e.target.style.background = '#238636'; }}
            >
              {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={16} />}
              {isLoading ? 'Verifying…' : 'Verify Code'}
            </button>
          </form>

          {/* Resend row */}
          <div style={{ textAlign: 'center', borderTop: '1px solid #21262d', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#8b949e', margin: '0 0 8px' }}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              style={{
                background: 'none',
                border: 'none',
                cursor: resendCooldown > 0 || isLoading ? 'not-allowed' : 'pointer',
                color: resendCooldown > 0 ? '#545d68' : '#58a6ff',
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}
            >
              <RefreshCw size={13} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#545d68' }}>
          Wrong email?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }}
            style={{ color: '#8b949e', textDecoration: 'underline' }}>
            Go back
          </a>
        </p>
      </div>

      {/* Keyframe animations via style tag */}
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
