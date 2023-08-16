const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
  joinId: String,
  users: [{
    userId: String,
    name: String
  }],
  msgs: [
    {
      userId: String,
      // name: String,
      text: String,
    }
  ]
});

const chatModel = model('chats', chatSchema);

module.exports = chatModel;