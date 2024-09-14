const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'config/.env') })

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const db = require('./database')
const passport = require('./auth');
const cors = require('cors')

const initializeWorkoutPlans = require('./util/initializeWorkoutPlans');

if (process.env.NODE_ENV !== 'test') {
  initializeWorkoutPlans()
  .then(() => console.log('Workout plans initialized'))
  .catch(error => console.error(error));
}
const app = express();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ client: db.getClient() })
})

// Middleware
app.use(cors({ origin:true,credentials:true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);

// Passport
app.use(passport.session());

// Routing
app.use('/', require('./routes'));

// Socket server configuration
const io = require('socket.io')();
const Message = require('./database/models/message');
const GLOBAL_MESSAGE_STRING = "global";

io.on('connection', (socket) => {
  socket.on('hello', () => socket.emit('hello'))
  socket.on('message', async ({ message, global, conversationId }) => {
    if (!message) return;
    if (global) {
      // Save message in database
      const newMessage = new Message({
        sender: socket.request.user.id,
        message: message,
        timestamp: new Date(),
        global: true
      });
      newMessage.save()
        .then((val) => {
          io.emit('message', {
            sender: {
              _id: socket.request.user._id,
              firstName: socket.request.user.firstName,
              lastName: socket.request.user.lastName,
              fullName: socket.request.user.fullName,
              image: socket.request.user.image,
            },
            message,
            global: global,
            conversationId: conversationId,
            timestamp: new Date(),
            _id: val._id,
          });
        });
    } else {
      // TODO: Handle other conversation IDs
      console.log(`Unknown conversation ID ${conversationId}`)
    }
  })
})

module.exports = app
module.exports.sessionMiddleware = sessionMiddleware
module.exports.passport = passport
module.exports.io = io
