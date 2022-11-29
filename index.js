const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./src/config/db.config.js');
//const chatService = require('./src/services/cats.services.js');
const auth = require('./src/middlewares/auth.js');
const errors = require('./src/middlewares/error.js');
const app = express();

const cors = require('cors');
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(`Database can not be connected: ${err}`);
  });
app.use(express.json());
app.use(cors());
app.use('/images', (req, res) => {
  res.send('test');
});
app.use('/images', express.static('./src/uploads/images'));
app.use('/users', require('./src/routes/users.routers.js'));
app.use('/cats', require('./src/routes/cats.routers.js'));
app.use('/chat', require('./src/routes/chat.routers.js'));
//app.use(error.errorHandler);

app.listen(5000, () => {
  console.log('start server');
  //chatService.chat();
});

//server.listen(4001);
