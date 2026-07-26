import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter configured for Brevo (formerly Sendinblue) SMTP relay.
 *
 * Environment variables required (set in root .env):
 *   SMTP_USER   — your Brevo SMTP login  (e.g. a248ae001@smtp-brevo.com)
 *   SMTP_PASS   — your Brevo SMTP master password / API key
 *   SENDER_EMAIL — the "From" address shown to recipients
 *
 * Brevo SMTP settings:
 *   Host : smtp-relay.brevo.com
 *   Port : 587
 *   Auth : LOGIN  (user + pass)
 */
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,          // STARTTLS on port 587
    auth: {
        user: process.env.SMTP_USER,   // read from .env
        pass: process.env.SMTP_PASS,   // read from .env
    },
    tls: {
        rejectUnauthorized: false,      // avoid self-signed cert errors in dev
    },
});

/**
 * Verify the transporter connection at startup (optional — logs to console).
 * Remove or comment out in production if you prefer silent startup.
 */
transporter.verify((error) => {
    if (error) {
        console.error('[Mailer] ❌  SMTP connection failed:', error.message);
    } else {
        console.log('[Mailer] ✅  SMTP ready — connected to smtp-relay.brevo.com:587');
    }
});

export default transporter;
