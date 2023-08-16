const chat = require('../models/chat_model');
const Users = require("../models/user_model");

exports.getChatsName = async (req, res) => {
  try{
    console.log(req.body);
    const data = await chat.find({_id: {$in: req.body}})
    res.status(200).json({data});
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
};

exports.newChat = async (req, res) => {
  try{
    console.log(req.body);
    const {users, joinId} = req.body;
    const data = await chat.create(req.body);
    const userDate = await Users.updateMany({_id: {$in: [users[0].userId, users[1].userId]}}, {$push: {chats: {chatId: data._id, joinId}}});
    res.status(201).json({data});
  }
  catch(error){
    res.status(400).json({
      message: error.message
    });
  }
};

exports.updateChat = async (req, res) => {
  try{
    const {joinId, msg} = req.body;
    const data = await chat.findOneAndUpdate({joinId}, {$push: {msgs: msg}}, {new: true});
    console.log('====>', req.body);
    res.status(200).json({data});
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
};