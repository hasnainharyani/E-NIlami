// const fs = require('fs').promises;
const Users = require("../models/user_model");
const userActivity = require('../models/user_activity_model');
const jwt = require('jsonwebtoken');
const { dirname } = require('path');
const path = require('path');
// const appDir = dirname(require.main.filename);

exports.getUsersData = async (req, res) => {
  try {
    const data = await Users.find();
    res.status(200).json({ data });
  } 
  catch (err) {
    res.status(400).json({ err });
  }
};

exports.getOneUserData = async (req, res) => {
  try{
    const {Id} = req.params;
    const data = await Users.findById(Id);
    res.status(200).json({data});
  }
  catch(err){
    res.status(400).json({ err: err.Error });
  }
};

exports.getOneUserAds = async (req, res) => {
  try{
    const {Id} = req.params;
    let data = await userActivity.find({user_id: Id});

    // for await(let obj of data){
    //   const extensionName = path.extname(obj.images[0]);
    //   const base64Img = await convertImgToBase64(obj.images[0]);
    //   const base64ImgStr = `data:image/${extensionName.split('.')[1]};base64,${base64Img}`;
    //   obj.images[0] = base64ImgStr;
    // }

    res.status(200).json({data});
  }
  catch(err){
    res.status(400).json({error: 'No data found.'});
  }
};

exports.loginUser = async (req, res) => {
  try{
    const {email, password} = req.body;

    if(!email || !password){
      throw 'Please provide email and password!';
    }

    const data = await Users.findOne({email, password});

    if(!data) throw 'Invalid email or password.';

    const token = jwt.sign({id: data._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
    res.status(200).json({token, data});
  }
  catch(err){
    res.status(400).json({ err });
  }
}

exports.createUser = async (req, res) => {
  try {
    let {name, lastname, nic, contact, location, email, password, username} = req.body;
    console.log(req.body);
    const data = await Users.create({name, lastname, nic, contact, location, email, password, username, isDisable: false});
    res.status(200).json({ data });
  } 
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCategoryWiseAds = async (req, res) => {
  try{
    const {categoryName} = req.params;
    let data = await userActivity.find({category: categoryName, activity: 'SELL', isDisable: false}).sort('-date').populate('user_id');
    res.status(200).json({data});
  }
  catch(err){
    res.status(400).json({err});
  }
}

exports.getUsersAds = async (req, res) => {
  try {
    let vehicleData = await userActivity.find({category: 'Vehicle', activity: 'SELL', isDisable: false}).sort('-date').limit(3).populate("user_id");
    let electronicsData = await userActivity.find({category: 'Electronics', activity: 'SELL', isDisable: false}).sort('-date').limit(3).populate("user_id");
    let houseData = await userActivity.find({category: 'House', activity: 'SELL', isDisable: false}).sort('-date').limit(3).populate("user_id");
    
    res.status(200).json({ data: {Vehicle: [...vehicleData], Electronics: [...electronicsData], House: [...houseData]} });
  } 
  catch (err) {
    res.status(400).json({ err });
  }
};

exports.getAuctionList = async (req, res) => {
  try{
    //check whether auction has expired or not
    const date = new Date();
    await userActivity.updateMany({end_date: { $lt: date.getTime() }}, {isDisable: true});
    let data = await userActivity.find({activity: 'BID', isDisable: false}).populate("user_id");
    // data = await loopingCategories(data);
    res.status(200).json({data});
  }
  catch(error){
    res.status(400).json({error});
  }
};

exports.placeBid = async (req, res) => {
  try{
    let {id: _id} = req.params;
    let {user_Id, name, bid} = req.body;
    bid *= 1;

    let data = await userActivity.findOneAndUpdate({_id}, {$push: {highest_bidder: {user_Id, name, bid}}}, {new: true});
    console.log(data);
    res.status(200).json({msg: 'Bid placed successfully.'});
  }
  catch(error){
    res.status(400).json({error});
  }
};

exports.addUserActivity = async (req, res) => {
  try{
    if(req.body.activity === 'BID'){
      const timeStamp = JSON.parse(req.body.date);
      const date = new Date(timeStamp);
      date.setDate(date.getDate() + 1);
      req.body.end_date = date.getTime();
    }
  
    let data = await userActivity.create(req.body);
    res.status(200).json({data});
  }
  catch(err){
    res.status(400).json({err});
  }
};

exports.searchItems = async (req, res) => {
  try{
    const {location, item} = req.body;
    let data;

    if(location && item){
      data = await userActivity.find({ $or: [ 
        {item_name: {$regex: item, $options: 'i'}}, 
        {category: {$regex: item, $options: 'i'}},
        {location}
        // {location: {$regrex: location, $options: 'i'}}
      ] }).populate("user_id");
    }
    else if(item){
      data = await userActivity.find({ $and: [ 
        {item_name: {$regex: item, $options: 'i'}}, 
        // {category: {$regex: item, $options: 'i'}},
      ] }).populate("user_id");
    }
    else if(location){
      data = await userActivity.find({ location }).populate("user_id");
    }

    res.status(200).json({data});
  }
  catch(err){
    res.status(400).json({err});
  }
};