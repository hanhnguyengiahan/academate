import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  token: {
    type: String
  }
});
const Session = mongoose.model("Session", SessionSchema);

export default Session;
