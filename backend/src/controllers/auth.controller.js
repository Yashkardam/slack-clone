import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from "dotenv";

dotenv.config();
const JWT_ACCESS_SECRET= process.env.JWT_ACCESS_SECRET
const NODE_ENV = process.env.NODE_ENV 

const cookieOpts = (maxAgeMs) => ({
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: maxAgeMs,
  path: '/'
});


const signAccess = (sub) =>
  jwt.sign({}, JWT_ACCESS_SECRET, { subject: String(sub), expiresIn: '15m' });

export async function register(req, res) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ email, password, name });

  
    const accessToken = signAccess(user.id);
    res
      .cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000))
      .status(201)
      .json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccess(user.id);
    res
      .cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000))
      .json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
