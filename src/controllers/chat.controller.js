require('dotenv').config();
const StreamChat = require('stream-chat').StreamChat;
exports.getToken = async (req, res, next) => {
  const userId = req.body.userId;
  // Initialize a Server Client
  const serverClient = StreamChat.getInstance(
    process.env.api_key,
    process.env.api_secret
  );
  // Create User Token
  const token = serverClient.createToken(userId);
  res.status(200).send(token);
};
