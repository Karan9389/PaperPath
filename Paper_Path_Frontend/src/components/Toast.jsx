import React, { useState, useCallback, useEffect, useRef } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

const palette = {
  success: {
    bg:     'rgba(35, 134, 54, 0.12)',
    border: 'rgba(63, 185, 80, 0.35)',
    icon:   '#3fb950',
    bar:    '#3fb950',
  },
  error: {
    bg:     'rgba(218, 54, 51, 0.12)',
    border: 'rgba(248, 81, 73, 0.35)',
    icon:   '#f85149',
    bar:    '#f85149',
  },
  info: {
    bg:     'rgba(88, 166, 255, 0.10)',
    border: 'rgba(88, 166, 255, 0.30)',
    icon:   '#58a6ff',
    bar:    '#58a6ff',
  },
  warning: {
    bg:     'rgba(227, 179, 65, 0.10)',
    border: 'rgba(227, 179, 65, 0.35)',
    icon:   '#e3b341',
    bar:    '#e3b341',
  },
};

// ─── Single Toast item ────────────────────────────────────────────────────────
function ToastItem({ id, type = 'info', message, duration = 4000, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const colors = palette[type] || palette.info;

  // Entrance animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Progress bar countdown
  useEffect(() => {
    const step = 100 / (duration / 50);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p <= step) {
          clearInterval(intervalRef.current);
          dismiss();
          return 0;
        }
        return p - step;
      });
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onRemove(id), 350);
  }, [id, onRemove]);

  return (
    <div
      onClick={dismiss}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        padding: '14px 16px 18px',
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        userSelect: 'none',
        maxWidth: '360px',
        minWidth: '280px',
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
      }}
    >
      {/* Icon */}
      <span style={{ color: colors.icon, flexShrink: 0, marginTop: '1px' }}>
        {icons[type]}
      </span>

      {/* Message */}
      <p style={{
        margin: 0,
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#e6edf3',
        fontWeight: 500,
        flex: 1,
      }}>
        {message}
      </p>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: colors.bar,
        borderRadius: '0 0 0 10px',
        transition: 'width 50ms linear',
        opacity: 0.8,
      }} />
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem {...t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
let _counter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_counter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error',   dur),
    info:    (msg, dur) => addToast(msg, 'info',    dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  return { toasts, toast, removeToast };
}
