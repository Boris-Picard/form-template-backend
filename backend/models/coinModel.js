import mongoose from "mongoose";

const Schema = mongoose.Schema;

const coinSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const coin = mongoose.model("Coin", coinSchema);

export default coin;
