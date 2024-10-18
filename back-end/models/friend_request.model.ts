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

  matchingCard : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MatchingCard',
  }
});
const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;
