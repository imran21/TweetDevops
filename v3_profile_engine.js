var express = require('express');
var app=express();
var router = express.Router();
var mongoose = require('mongoose');

var port = 2020;
var host = '192.168.1.3'
app.set('view engine', 'ejs');
mongoose.connect("mongodb://192.168.1.2:27017/User_Profile");
var db =  mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");

 });
 var profileSchema = mongoose.Schema;
 var tProfData = new profileSchema ({
				
				 user_Id:{

				 type: String,
				 required: true,
				 unique: true
				},
 				 user_Screen_name: {

 				 type: String,
 				 required: true,
 				 unique: true
 				}
				 }, { versionKey: false });
 	


app.get('/:id/:user_s_name',function(req,res,next){
	console.log(req.params.id+" "+req.params.user_s_name);
	var req_user_uid=req.params.id;
	var req_user_s_name=req.params.user_s_name;
	res.send("The Requested user is :"+req_user_uid+" "+req_user_s_name)

	//next();

	 		 var tprof_db = mongoose.model('user_profile_list', tProfData);
        var tprof_col = new tprof_db ({
        	user_Id:req_user_uid,
        	user_Screen_name:req_user_s_name


        });
        tprof_col.save(function(error, doc) {
                if(!error) {
                console.log("Insert Success");
                }
                else {
                console.log("error in saving file"+ error);
                }
            });
	 
})





app.listen(port, host,function (error, response){
	if(!error)
	{
		console.log("Profile_Engine running at "+host+":"+port);
	}

});
