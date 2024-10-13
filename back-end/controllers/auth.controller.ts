import { Request, Response } from 'express';
import { Token } from '../types/types';
import User from '../models/user.model';
import { sign, decode, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET;
const register = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await hash(req.body.password, 10);
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword // Ensure password is hashed
        });
        const token = sign(
            { id: newUser._id }, // Payload (data to include in the token)
            SECRET_KEY // Secret key to sign the token
        );
        res.status(200).json({token: token});
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

        const token = sign(
            { id: user._id }, 
            SECRET_KEY
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout
export { register, login };
