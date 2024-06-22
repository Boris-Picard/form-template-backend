import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    mail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    coins: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coin",
      },
    ],
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
