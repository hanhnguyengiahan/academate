import { Request, Response } from 'express';
import { Token } from '../types/types';
import User from '../models/user.model';
import Session from '../models/session.model';
import { sign, decode, verify, JwtPayload } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import dotenv from 'dotenv';
import FriendRequest from '../models/friend_request.model';
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET;
const send_request = async (req: Request, res: Response) => {
    try {
        const { token, receiver_id } = req.body;
        if (!token || !receiver_id) {
            return res.status(400).json({ message: 'Token and receiver ID are required' });
        }
        const validSession = await Session.findOne( { token });
        if (!validSession) {
            return res.status(400).json( { message: 'Invalid token' });
        }
        const payload = verify(token, SECRET_KEY) as JwtPayload;
        if (!payload.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const sender_id = payload.userId;
        const friendRequest = await FriendRequest.create({
            sender: sender_id,
            receiver: receiver_id,
            status: "Pending"
        });
        const current_user = await User.findById(sender_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }
        current_user.requests.push(friendRequest._id);
        await current_user.save();
        res.status(200).json( { message: "Friend request sent successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const accept_friend_request = async (req: Request, res: Response) => {
    try {
        const { token, friend_request_id } = req.body;
        if (!token || !friend_request_id) {
            return res.status(400).json({ message: 'Token and friend request id are required' });
        }
        const validSession = await Session.findOne( { token });
        if (!validSession) {
            return res.status(400).json( { message: 'Invalid token' });
        }
        const payload = verify(token, SECRET_KEY) as JwtPayload;
        if (!payload.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const current_user_id = payload.userId;
        const current_user = await User.findById(current_user_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const validRequest = await FriendRequest.findById(friend_request_id);
        if (!validRequest) {
            return res.status(403).json({ message: 'Friend request does not exist'});
        }
        const requestBelongsToUser = current_user.requests.find((req) => req === friend_request_id);
        if (!requestBelongsToUser) {
            return res.status(403).json({ message: 'Friend request does not belong to the user'});
        }
        const 
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const remove_current_friend = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        
        const validSession = await Session.findOne({ token });
        if (!validSession) {
            return res.status(401).json({ message: 'Invalid credentatials' });
        }

        await Session.findOneAndDelete({
            token
        });
        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { send_request, login, logout };
