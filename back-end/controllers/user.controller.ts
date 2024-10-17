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

        const sender = await User.findById(sender_id);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        const receiver = await User.findById(receiver_id);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
        
        sender.sent_requests.push(friendRequest._id);
        receiver.received_requests.push(friendRequest._id);

        await receiver.save();
        await sender.save();

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
        let current_user = await User.findById(current_user_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const validRequest = await FriendRequest.findById(friend_request_id);
        if (!validRequest) {
            return res.status(403).json({ message: 'Friend request does not exist'});
        }
        
        // both are friend
        current_user.friends.push(validRequest.sender);
        let sender = await User.findById(validRequest.sender);
        sender.friends.push(current_user_id);

        // accept needs to delete the friend_request_id out of our database
        await FriendRequest.deleteOne({ _id: friend_request_id });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const remove_current_friend = async (req: Request, res: Response) => {
    try {
        const { token, friend_id } = req.body;
        
        const validSession = await Session.findOne({ token });
        if (!validSession) {
            return res.status(401).json({ message: 'Invalid credentatials' });
        }
        // find the current user
        const payload = verify(token, SECRET_KEY) as JwtPayload;
        if (!payload.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const current_user_id = payload.userId;
        let current_user = await User.findById(current_user_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // find the user with friend _id
        let friend_user = await User.findById(friend_id);
        if (!friend_user) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        // remove out of friend array of current user
        let friendIndex = current_user.friends.findIndex((fr) => fr._id === friend_id);
        current_user.friends.splice(friendIndex, 1);
        await current_user.save();

        // remove current out of friend array
        let currentIndex = friend_user.friends.findIndex((fr) => fr._id === current_user_id);
        current_user.friends.splice(currentIndex, 1);
        await current_user.save();

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const list_friend = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const validSession = await Session.findOne({ token });
        if (!validSession) {
            return res.status(401).json({ message: 'Invalid credentatials' });
        }
        // find the current user
        const payload = verify(token, SECRET_KEY) as JwtPayload;
        if (!payload.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const current_user_id = payload.userId;
        let current_user = await User.findById(current_user_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({friends: current_user.friends});
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const list_sent_requests = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const validSession = await Session.findOne({ token });
        if (!validSession) {
            return res.status(401).json({ message: 'Invalid credentatials' });
        }
        // find the current user
        const payload = verify(token, SECRET_KEY) as JwtPayload;
        if (!payload.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const current_user_id = payload.userId;
        let current_user = await User.findById(current_user_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({sent_requests: current_user.sent_requests});
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const list_received_requests = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const validSession = await Session.findOne({ token });
        if (!validSession) {
            return res.status(401).json({ message: 'Invalid credentatials' });
        }
        // find the current user
        const payload = verify(token, SECRET_KEY) as JwtPayload;
        if (!payload.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const current_user_id = payload.userId;
        let current_user = await User.findById(current_user_id);
        if (!current_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({received_requests: current_user.received_requests});
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}
export { send_request, accept_friend_request, remove_current_friend, list_friend, list_sent_requests, list_received_requests };
