import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    match: /^z\d{7}@ad\.unsw\.edu\.au$/,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  gender: {
    type: String,
    required: true
  },

  matchingCards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MatchingCard',
    },
  ],

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FriendRequest'
    }
  ]
});
const User = mongoose.model("User", UserSchema);
export default User;
