var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = new Schema({
	goods_name : String,
	goods_num : String,
	price : Number,
    details : String,
    inventory : Number,
    is_best : String,
    is_new : String,
    is_hot : String,
    cat_id : String,
    virtual : Number,
	create_date: {type:Date,default:Date.now}
});
 var UserModel = mongoose.model("user",User);
 module.exports = UserModel;