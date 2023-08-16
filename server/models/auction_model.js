const {Schema,model} = require('mongoose');
const validator = require('validator');

const userSchema=new Schema({
user_id: [{ type: Schema.Types.ObjectId, ref: 'users' }],
activity:{
    type:String,
    required:[true,"Activity name is Required"]
},
highest_bidder:{
    type:String,
},
image:[{
    type:String
}]
,
condition:{
    type:String,
    required:[true,"Condition is Required"],
},
end_date:{
    type:Date,
    required:[true,"Price is Required"]
},
description:{
    type:String
},
isDisable:Boolean
});

exports.default = model('user_Activity',userSchema)