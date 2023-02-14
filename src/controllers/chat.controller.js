require('dotenv').config();
const StreamChat = require('stream-chat').StreamChat;
exports.getToken = async (req, res, next) => {
  const userId = req.body.userId;
  // Initialize a Server Client
  const serverClient = StreamChat.getInstance(
    'd5xc47m4hufd',
    'qnz7de9pagq8xkg7fa4prtwf8jzyyn346vpqzz83ff5j3z6zskgp2hmua3t3jezx'
  );
  // Create User Token
  const token = serverClient.createToken(userId);
  res.status(200).send(token);
};
