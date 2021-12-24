var express = require('express');
var app=express();
var router = express.Router();
var mongoose = require('mongoose');
require('dotenv').config();


var port = process.env.MS_HASHTAG_PORT;
var host = process.env.MS_HASHTAG_HOST;
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
 				 hash_tag: {

 				 type: String,
 				 required: true 				
 				},
                 date_at: {
                    type: String,
                    required: true
                    
                 }
				 }, { versionKey: false });
 	


app.get('/:id/:user_hashtag/:date_at',function(req,res,next){
	//console.log(req.params.id+" "+req.params.user_channel);
	

    var twit_hashtag_string=req.params.user_hashtag;
    var twit_hashtag_substring = twit_hashtag_string.substring(
        twit_hashtag_string.indexOf(">") + 1, 
        twit_hashtag_string.lastIndexOf("<")
    );
    var req_user_uid=req.params.id;
	var req_hashtag=twit_hashtag_string;
    var date_at=req.params.date_at;
    console.log(req_user_uid+" "+req_hashtag+" "+date_at)
	res.send("The Requested user is :"+req_user_uid+" "+req_hashtag);


	//next();
    

	 		 var tprof_db = mongoose.model('hastags', tProfData);
        var tprof_col = new tprof_db ({
        	user_Id:req_user_uid,
        	hash_tag:req_hashtag,
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
		console.log("Hash Tag Engine running at "+host+":"+port);
	}

});

