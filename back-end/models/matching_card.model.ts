import mongoose from 'mongoose';

const MatchingCard = new mongoose.Schema({
  course_code: {
    type: String,
    required: true,
  },

  grade: {
    type: String,
    enum: ['HD', 'D', 'CR', 'PS']
  },

  objective: {
    type: String
  }
});

export default MatchingCard;
