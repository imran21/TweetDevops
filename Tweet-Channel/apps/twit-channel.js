var express = require('express');
var app=express();
var router = express.Router();
var mongoose = require('mongoose');
require('dotenv').config();
var port = process.env.MS_CHANNEL_PORT;
var host = process.env.MS_CHANNEL_HOST;
app.set('view engine', 'ejs');
mongoose.connect("mongodb://"+process.env.MONGODB_URL+":"+process.env.MONGODB_PORT+"/"+process.env.MONGODB_DB_NAME);
var db =  mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");

 });
 var profileSchema = mongoose.Schema;
 var tProfData = new profileSchema ({
				
				 user_Id:{

				 type: String,
				 required: true
				 
				},
 				 user_channel: {

 				 type: String,
 				 required: true
 				 
 				},
				 date_at: {
		                 type: String,
                                 required: true
                               }
				 }, { versionKey: false });
 	


app.get('/:id/:user_channel/:date_at',function(req,res,next){
	//console.log(req.params.id+" "+req.params.user_channel);
	

    var twit_source_string=req.params.user_channel;
    var twit_source_substring = twit_source_string.substring(
        twit_source_string.indexOf(">") + 1, 
        twit_source_string.lastIndexOf("<")
    );
    var req_user_uid=req.params.id;
	var req_user_channel=twit_source_substring;
    var date_at=req.params.date_at;
    console.log(req_user_uid+" "+req_user_channel+" "+date_at)
	res.send("The Requested user is :"+req_user_uid+" "+req_user_channel);


	//next();
    

	 		 var tprof_db = mongoose.model('channel', tProfData);
        var tprof_col = new tprof_db ({
        	user_Id:req_user_uid,
        	user_channel:req_user_channel,
			date_at:date_at

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
		console.log("Tweet User Channel running at "+host+":"+port);
	}

});

