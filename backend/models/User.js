import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatarUrl: String,
  superUser: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema);
