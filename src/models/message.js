import mongoose, { Schema } from "mongoose";
const { ObjectId } = Schema.Types;

const messageSchema = new Schema({
  body: String,
  sender: {
    type: ObjectId,
    ref: "User",
  },
  chat: {
    type: ObjectId,
    ref: "Chat",
  },
});

export default mongoose.model("Message", messageSchema);
