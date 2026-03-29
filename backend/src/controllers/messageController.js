const Message = require("../models/messageModel");

// ✅ Get chat history between logged-in user and a target user
async function getMessages(req, res) {
  try {
    const { userId } = req.params;
    const myId = req.user.id;

    // Find all messages where sender is me and receiver is them, OR sender is them and receiver is me.
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 }); // Oldest to newest for chat feeds

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Get all active conversations (Inbox left-pane mapping)
async function getConversations(req, res) {
  try {
    const myId = req.user.id;

    // Fetch all messages I am involved in, sorted youngest first
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: -1 });

    const usersMap = new Map();

    messages.forEach((msg) => {
      // Isolate the user that isn't me
      const otherUser = msg.sender._id.toString() === myId ? msg.receiver : msg.sender;
      
      // If we haven't mapped them yet, they get added with their most recent message
      if (otherUser && !usersMap.has(otherUser._id.toString())) {
        usersMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
        });
      }
    });

    const conversations = Array.from(usersMap.values());

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getMessages,
  getConversations,
};
