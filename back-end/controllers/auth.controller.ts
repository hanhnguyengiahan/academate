import { Request, Response } from 'express';
import User from '../models/user.model';
import Session from '../models/session.model';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const register = async (req: Request, res: Response) => {
  try {
    const emailUsed = await User.findOne({ email: req.body.email});
    if (emailUsed) {
      return res.status(400).json({error: 'Email address used by another user'});
    }
    const hashedPassword = await hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword, // Ensure password is hashed
    });
    const token = sign(
      { id: newUser._id }, // Payload (data to include in the token)
      SECRET_KEY // Secret key to sign the token
    );
    await Session.create({
      token,
    });
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = sign({ id: user._id }, SECRET_KEY);
    await Session.create({
      token,
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    await Session.findOneAndDelete({
      token,
    });
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { register, login, logout };
