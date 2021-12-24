var express = require('express');
var app=express();
var router = express.Router();
var mongoose = require('mongoose');
require('dotenv').config();

var port = process.env.MS_GEO_WALK_PORT;
var host = process.env.MS_GEO_WALK_HOST;
app.set('view engine', 'ejs');
mongoose.connect("mongodb://"+process.env.MONGODB_URL+":"+process.env.MONGODB_PORT+"/"+process.env.MONGODB_DB_NAME);
//mongoose.set('useCreateIndex', true);

var db =  mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");

 });
 var geowalk_Schema = mongoose.Schema;
 var geowalk_Schema_var = new geowalk_Schema ({
				
				 user_id:{
					 type: String,
					 required: true,
				         unique: true,
					 index:true
					 
				},
 				 user_screen_name: {
	 				 type: String,
	 				 required: true,
					unique: true,
					 index:true
 				},
 				user_geowalk_data: [{
 					latlon:String
 				}]
				 }, { versionKey: false },{ _id : false });
 	


app.get('/:id/:user_s_name/:geo_data/',function(req,res,next){
	console.log(req.params.id+" "+req.params.user_s_name+" "+req.params.geo_data);
	var req_user_uid=req.params.id;
	var req_user_s_name=req.params.user_s_name;
	var req_geo_data=req.params.geo_data
	res.send("The Requested user is :"+req_user_uid+"  "+req_user_s_name+" at location "+req_geo_data)

	//next();

	var geowalk_db = mongoose.model('user_geo_data', geowalk_Schema_var);
        var tprof_col = new geowalk_db ({
        	user_id:req_user_uid,
        	user_screen_name:req_user_s_name,
        	user_geowalk_data: [{latlon:req_geo_data}]



        });

        geowalk_db.find({user_id:req_user_uid}, function(err,data){
        	if(!err)
        	{
        		console.log(data)

        	}
        	else
        	{
        		console.log("NO DATA FOUND")
        	}
        });

                tprof_col.save(function(error, doc) {
                if(!error) {
                console.log("Insert Success");
                }
                else {
                console.log("error in saving file"+error);
                }
            });
	 
})





app.listen(port, host,function (error, response){
	if(!error)
	{
		console.log("User_geowalk running at "+host+":"+port);
	}

});

