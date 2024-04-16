// Package imports
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// --------------------- Send Message Controller ---------------------
export const sendMessage = async (req, res) => {
  try {
    // fetch message and receiverId from req.body and req.params
    const { message } = req.body;
    const { id: receiverId } = req.params;

    // fetch senderId from req.user
    const senderId = req.user._id;

    // find conversation with senderId and receiverId
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // if no conversation, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // push new message to conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    
    // save new message and conversation
    await Promise.all([newMessage.save(), conversation.save()]); // this will run in parallel
    
    // Socket.io functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      // send new message to receiver
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // send new message as response
    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error send message controller", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try{
    const {id: userToChatId} = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if(!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (err) {
    console.log("Error get messages controller", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}