import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const user = mongoose.model("User", userSchema);

export default user;
