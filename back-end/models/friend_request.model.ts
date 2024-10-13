import mongoose from 'mongoose';

const FriendRequest = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  status: {
    type: String,
    enum: ['Pending', 'Accepted'],
  },
});

export default FriendRequest;
