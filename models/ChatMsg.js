import mongoose from "mongoose";

const ChatMsgSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    time_date: {
        type: String,
        required: true,
    }
});

export default mongoose.model("chat_messages", ChatMsgSchema);