import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
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
const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;
