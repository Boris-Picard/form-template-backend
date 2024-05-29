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
});

const coin = mongoose.model("Coin", coinSchema);

export default coin;
