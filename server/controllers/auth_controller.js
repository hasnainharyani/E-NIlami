const jwt = require('jsonwebtoken');
const Users = require('../models/user_model');

exports.protect = async (req, res, next) => {
  try{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) throw new Error('You are not logged in, please login to get access');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id);

    if(!user){
      throw new Error('This is user does no longer exist.');
    }
    
    next();
  }
  catch(err){
    console.log(err.message);
    res.status(400).json({"Error": err.message});
  }
};