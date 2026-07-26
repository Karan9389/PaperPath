import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter for Brevo (formerly Sendinblue) SMTP relay.
 *
 * WHY LAZY? — ES module imports are hoisted. If this file is imported before
 * dotenv.config() runs, process.env.SMTP_USER / SMTP_PASS will be undefined,
 * causing "Missing credentials for PLAIN". The lazy factory defers transport
 * creation until the first actual sendMail() call, by which time dotenv has
 * already populated process.env.
 *
 * Environment variables (root .env):
 *   SMTP_USER    — Brevo SMTP login   (e.g. a248ae001@smtp-brevo.com)
 *   SMTP_PASS    — Brevo SMTP key
 *   SENDER_EMAIL — the "From" address shown to recipients
 */

let _transporter = null;

function getTransporter() {
    if (_transporter) return _transporter;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('[Mailer] ❌  SMTP_USER or SMTP_PASS is missing from .env');
        return null;
    }

    _transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,                   // STARTTLS on port 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,   // avoid self-signed cert errors in dev
        },
    });

    // Verify once when first built
    _transporter.verify((error) => {
        if (error) {
            console.error('[Mailer] ❌  SMTP connection failed:', error.message);
            _transporter = null;         // reset so next attempt retries
        } else {
            console.log('[Mailer] ✅  SMTP ready — smtp-relay.brevo.com:587');
        }
    });

    return _transporter;
}

/**
 * Drop-in replacement for transporter.sendMail().
 * Returns a resolved promise (no-op) if credentials are missing.
 */
const transporter = {
    sendMail: (options) => {
        const t = getTransporter();
        if (!t) return Promise.resolve();
        return t.sendMail(options);
    },
};

export default transporter;

