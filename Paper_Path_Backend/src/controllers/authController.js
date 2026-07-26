import mongoose from 'mongoose';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/mailer.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'paperpath-secret';
    const tokenPayload = typeof payload === 'object' && payload !== null ? payload : { id: payload };
    return jwt.sign(tokenPayload, secret, { expiresIn: '30d' });
};

/** Generate a random 6-digit OTP string (handles leading zeros safely). */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const DEMO_CREDENTIALS = {
    email: 'demo@paperpath.com',
    password: 'demo1234',
};

const fallbackUsers = new Map();

const buildUserPayload = (user) => {
    const userId = user._id || user.id || 'demo-user';
    return {
        _id: userId,
        name: user.name || 'Demo User',
        email: user.email,
        isAccountVerified: user.isAccountVerified ?? true,
        token: generateToken({
            id: userId,
            name: user.name || 'Demo User',
            email: user.email,
            role: user.role || 'user',
        }),
    };
};

const canUseDatabase = () => mongoose.connection.readyState === 1;

const saveFallbackUser = (user) => {
    if (!user?.email) return null;
    const safeUser = {
        _id: user._id || user.id || 'demo-user',
        name: user.name || 'Demo User',
        email: user.email,
        password: user.password,
    };
    fallbackUsers.set(user.email.toLowerCase(), safeUser);
    return safeUser;
};

const findFallbackUser = (email, password) => {
    const storedUser = fallbackUsers.get(email.toLowerCase());
    if (storedUser && storedUser.password === password) return storedUser;
    return null;
};

// ─── Styled OTP Email ─────────────────────────────────────────────────────────

const sendOtpEmail = (email, name, otp) =>
    transporter.sendMail({
        from: `"PaperPath 📚" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: `${otp} is your PaperPath verification code`,
        html: `
        <div style="font-family:Inter,sans-serif;max-width:520px;margin:auto;background:#0d1117;
                    color:#e6edf3;border-radius:12px;border:1px solid #30363d;padding:40px 32px">
            <div style="text-align:center;margin-bottom:24px">
                <div style="display:inline-flex;align-items:center;justify-content:center;
                            width:52px;height:52px;background:#161b22;border:1px solid #30363d;
                            border-radius:50%;font-size:24px">📚</div>
            </div>
            <h1 style="font-size:20px;font-weight:700;margin:0 0 8px;text-align:center">
                Verify your email address
            </h1>
            <p style="color:#8b949e;font-size:14px;margin:0 0 28px;text-align:center">
                Hi ${name || 'Researcher'}, enter this code in the app to verify your account.
            </p>

            <!-- OTP Box -->
            <div style="text-align:center;margin:0 0 28px">
                <div style="display:inline-block;background:#161b22;border:1px solid #58a6ff;
                            border-radius:10px;padding:18px 40px">
                    <span style="font-size:36px;font-weight:800;letter-spacing:12px;
                                 color:#58a6ff;font-family:monospace">${otp}</span>
                </div>
            </div>

            <p style="color:#545d68;font-size:12px;text-align:center;margin:0">
                This code expires in <strong style="color:#8b949e">10 minutes</strong>.
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>`,
    }).catch((err) => console.error('[Mailer] OTP email failed:', err.message));

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates user, generates OTP, sends email, returns requiresOtp flag.
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!canUseDatabase()) {
            const fallbackUser = saveFallbackUser({ _id: 'demo-user', name: name || 'Demo User', email, password });
            return res.status(201).json(buildUserPayload(fallbackUser));
        }

        const userExist = await User.findOne({ email }).catch(() => null);
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOtp();
        const otpExpiry = Date.now() + OTP_TTL_MS;

        const user = await User.create({
            name,
            email,
            password,
            verifyOtp: otp,
            verifyOtpExpireAt: otpExpiry,
        }).catch(() => null);

        if (!user) {
            const fallbackUser = saveFallbackUser({ _id: 'demo-user', name: name || 'Demo User', email, password });
            return res.status(201).json(buildUserPayload(fallbackUser));
        }

        saveFallbackUser(user);

        // Send OTP email (fire-and-forget)
        sendOtpEmail(email, name, otp);

        return res.status(201).json({
            requiresOtp: true,
            email,
            message: `A 6-digit verification code has been sent to ${email}`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/auth/login
 * Validates credentials. If account is unverified, sends a fresh OTP and
 * returns { requiresOtp: true } instead of a JWT token.
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Demo shortcut — always verified
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            return res.json(buildUserPayload({ _id: 'demo-user', name: 'Demo User', email }));
        }

        const fallbackUser = findFallbackUser(email, password);
        if (fallbackUser) {
            return res.json(buildUserPayload(fallbackUser));
        }

        if (!canUseDatabase()) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = await User.findOne({ email }).select('+password').catch(() => null);

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If account is not yet verified, issue a fresh OTP and gate access
        if (!user.isAccountVerified) {
            const otp = generateOtp();
            user.verifyOtp = otp;
            user.verifyOtpExpireAt = Date.now() + OTP_TTL_MS;
            await user.save().catch(() => {});

            sendOtpEmail(email, user.name, otp);

            return res.json({
                requiresOtp: true,
                email,
                message: `A verification code has been sent to ${email}`,
            });
        }

        return res.json(buildUserPayload(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 * Checks OTP validity, marks account as verified, returns full auth token.
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        if (!canUseDatabase()) {
            // Dev fallback: any 6-digit code passes
            const fb = fallbackUsers.get(email.toLowerCase());
            if (fb) return res.json(buildUserPayload(fb));
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findOne({ email }).catch(() => null);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check expiry
        if (!user.verifyOtpExpireAt || Date.now() > user.verifyOtpExpireAt) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Check match
        if (user.verifyOtp !== String(otp)) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Mark verified and clear OTP fields
        user.isAccountVerified = true;
        user.verifyOtp = null;
        user.verifyOtpExpireAt = 0;
        await user.save().catch(() => {});

        return res.json(buildUserPayload(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 * Generates and emails a fresh OTP for an unverified account.
 */
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        if (!canUseDatabase()) {
            return res.json({ message: 'OTP resent (dev mode)' });
        }

        const user = await User.findOne({ email }).catch(() => null);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.isAccountVerified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        const otp = generateOtp();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + OTP_TTL_MS;
        await user.save().catch(() => {});

        sendOtpEmail(email, user.name, otp);

        return res.json({ message: `A new verification code has been sent to ${email}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/auth/profile  (protected)
 */
const getUserProfile = async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    };
    res.json(user);
};

export { registerUser, loginUser, verifyOtp, resendOtp, getUserProfile };