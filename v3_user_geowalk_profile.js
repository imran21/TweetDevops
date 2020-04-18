var express = require('express');
var app=express();
var router = express.Router();
var mongoose = require('mongoose');

var port = 2021;
var host = '192.168.1.4'
app.set('view engine', 'ejs');
mongoose.connect("mongodb://192.168.1.2:27017/User_geowalk");
mongoose.set('useCreateIndex', true);

var db =  mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");

 });
 var geowalk_Schema = mongoose.Schema;
 var geowalk_Schema_var = new geowalk_Schema ({
				
				 user_Id:{
					 type: String,
					 required: true,
					 unique: true,
					 index:true
				},
 				 user_Screen_name: {
	 				 type: String,
	 				 required: true,
	 				 unique: true,
	 				 index:true
 				},
 				user_geowalk_data: [{
 					latlon:String
 				}]
				 }, { versionKey: false });
 	


app.get('/:id/:user_s_name/:geo_data',function(req,res,next){
	console.log(req.params.id+" "+req.params.user_s_name+" "+req.params.geo_data);
	var req_user_uid=req.params.id;
	var req_user_s_name=req.params.user_s_name;
	var req_geo_data=req.params.geo_data
	res.send("The Requested user is :"+req_user_uid+" "+req_user_s_name)

	//next();

	 		 var geowalk_db = mongoose.model('user_geo_data', geowalk_Schema_var);
        var tprof_col = new geowalk_db ({
        	user_Id:req_user_uid,
        	user_Screen_name:req_user_s_name,
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
                console.log("error in saving file");
                }
            });
	 
})





app.listen(port, host,function (error, response){
	if(!error)
	{
		console.log("User_geowalk running at "+host+":"+port);
	}

});
