const express = require("express");
const cors = require('cors');
const { userRouter, chatRouter } = require("./routes");
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

app.use(cors({origin: '*'}));
app.use(express.static(`${__dirname}/public/images`));
app.use(express.json());

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
  cors: {origin: 'http://localhost:4321'}
});

io.on('connection', (socket) => {
  console.log('a user has connected.', socket.id);
  
  socket.on('sendMsg', (data) => {
    socket.broadcast.emit("recieveMsg", data);
  });
  
  socket.on('disconnect', (data) => {
    console.log('user disconnected.', data);
  });
})

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   message: `Can't find ${req.originalUrl} on the server`
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports={app, server};
