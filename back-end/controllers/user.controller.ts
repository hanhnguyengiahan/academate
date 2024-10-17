import { Request, Response } from 'express';
import { Token } from '../types/types';
import User from '../models/user.model';
import Session from '../models/session.model';
import { sign, decode, verify, JwtPayload } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import dotenv from 'dotenv';
import FriendRequest from '../models/friend_request.model';
import MatchingCard from '../models/matching_card.model';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const send_request = async (req: Request, res: Response) => {
  try {
    const { token, receiver_id, matching_card_id } = req.body;
    if (!token || !receiver_id || !matching_card_id) {
      return res
        .status(400)
        .json({ message: 'Token and receiver ID are required' });
    }
    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    const payload = verify(token, SECRET_KEY) as JwtPayload;
    if (!payload.id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
    const sender_id = payload.id;
    const friendRequest = await FriendRequest.create({
      sender: sender_id,
      receiver: receiver_id,
      matchingCard: matching_card_id,
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

    res.status(200).json({ friendRequestId: friendRequest._id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const accept_friend_request = async (req: Request, res: Response) => {
  try {
    const { token, friend_request_id } = req.body;
    if (!token || !friend_request_id) {
      return res
        .status(400)
        .json({ message: 'Token and friend request id are required' });
    }
    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    const payload = verify(token, SECRET_KEY) as JwtPayload;
    if (!payload.id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
    const current_user_id = payload.id;
    let current_user = await User.findById(current_user_id);
    if (!current_user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const validRequest = await FriendRequest.findById(friend_request_id);
    if (!validRequest) {
      return res.status(403).json({ message: 'Friend request does not exist' });
    }

    // both are friend
    let sender = await User.findById(validRequest.sender);
    sender.friends.push({
      user: current_user,
      matchingCard: validRequest,
    });

    current_user.friends.push({
      user: sender,
      matchingCard: validRequest,
    });

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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = verify(token, SECRET_KEY) as JwtPayload;
    const current_user_id = payload?.id;
    if (!current_user_id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    // Find the current user
    const currentUser = await User.findById(current_user_id).populate(
      'friends.user'
    );
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the friend to remove in current user's friend list
    const currentUserFriendIndex = currentUser.friends.findIndex(
      (friend) => friend.user.id === friend_id
    );
    if (currentUserFriendIndex !== -1) {
      currentUser.friends.splice(currentUserFriendIndex, 1);
      await currentUser.save();
    } else {
      return res
        .status(404)
        .json({ message: 'Friend not found in your friend list' });
    }

    // Find the friend user
    const friendUser = await User.findById(friend_id).populate('friends.user');
    if (!friendUser) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Find the current user in friend's friend list
    const friendUserFriendIndex = friendUser.friends.findIndex(
      (friend) => friend.user.id === current_user_id
    );
    if (friendUserFriendIndex !== -1) {
      friendUser.friends.splice(friendUserFriendIndex, 1);
      await friendUser.save();
    } else {
      return res
        .status(404)
        .json({ message: "You are not in the friend's list" });
    }

    res.status(200).json({ message: 'Friend removed successfully' });
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
    if (!payload.id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
    const current_user_id = payload.id;
    let current_user = await User.findById(current_user_id);
    if (!current_user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let listOfSenderAndCards = await Promise.all(
      current_user.friends.map(async (req) => {
        return await FriendRequest.findById(req).populate(
          'sender',
          'matchingCard'
        );
      })
    );
    res.status(200).json({
      friends: listOfSenderAndCards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const list_sent_requests = async (req: Request, res: Response) => {
//     try {
//         const { token } = req.body;
//         const validSession = await Session.findOne({ token });
//         if (!validSession) {
//             return res.status(401).json({ message: 'Invalid credentatials' });
//         }
//         // find the current user
//         const payload = verify(token, SECRET_KEY) as JwtPayload;
//         if (!payload.id) {
//             return res.status(400).json({ message: 'Invalid token payload' });
//         }
//         const current_user_id = payload.id;
//         let current_user = await User.findById(current_user_id);
//         if (!current_user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({sent_requests: current_user.sent_requests});
//     } catch(error) {
//         res.status(500).json({ message: error.message });
//     }
// }

const list_received_requests = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required'});
    }
    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }
    // find the current user
    const payload = verify(token, SECRET_KEY) as JwtPayload;
    if (!payload.id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
    const current_user_id = payload.id;
    let current_user = await User.findById(current_user_id);
    if (!current_user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let listOfSenderAndCards = await Promise.all(
      current_user.received_requests.map(async (req) => {
        const populatedRequest = await FriendRequest.findById(req)
        .populate([{path: 'sender'}, {path: 'matchingCard'}])

        return {
          sender: populatedRequest.sender,
          matchingCard: populatedRequest.matchingCard,
        };
      })
    );

    return res.status(200).json({
      received_requests: listOfSenderAndCards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  send_request,
  accept_friend_request,
  remove_current_friend,
  list_friend,
  list_received_requests,
};
