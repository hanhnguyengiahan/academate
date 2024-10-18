import mongoose from 'mongoose';

const MatchingCardSchema = new mongoose.Schema({
  course_code: {
    type: String,
    required: true,
  },

  grade: {
    type: String,
    enum: ['HD', 'D', 'CR', 'PS'],
  },

  objective: [
    {
      type: String,
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  objectiveEmbedding: {
    type: Array,
  },
});
const MatchingCard = mongoose.model('MatchingCard', MatchingCardSchema);

export default MatchingCard;
