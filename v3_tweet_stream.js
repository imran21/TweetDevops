/* THIS FILE IS FOR GETTING PUBLIC STREAM
AIMED FOR <NEW YEAR TWEETS> ALL OVER THE WORLD
*/
var Twit = require('twit');
var mongoose = require('mongoose');
var request=require('request');
var http = require('http');
var fs=require('fs');
var T = new Twit({
    consumer_key:""
  , consumer_secret:""
  , access_token:""
  , access_token_secret:""
});
/*
var db = mongoose.connect('mongodb://localhost:27017/world_public_stream_2',{ useNewUrlParser: true }, function(err) {
//twit_data_chennai ->for date based search
if(err) {
console.log("mongoose ERROR-> Not connected");
}
else {
console.log("mongoose SUCCESS-> connected");
}

});
*/
 mongoose.connect("mongodb://192.168.1.2:27017/public_stream_db");
 
 var db = mongoose.connection;
 
 db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");

 });
//instragram access token 3538228122.1677ed0.4a67138571f74a8e934dc6cfab8dcf81
var tweetdataSchema = mongoose.Schema;
var tdata = new tweetdataSchema({
 created_at:String,
 created_timestamp:Number,
 user_ISO_Date:{type:Date, default:Date.now},
 user_text:String,
 user_hashtag:[],
 user_source:String,
//user profile info under user: {}
 user_Id:String,
 user_name:String,
 user_screenname:String,
 user_location:String,
 user_url:String,
 user_description:String,
 User_profile_location:String,
//End of user Profile info under user: {}
 user_geo:[],
 user_place_type:String,
 user_place_name:String,
 user_place_full_name:String,
 user_country_code:String,
 user_country_name:String
 }, { versionKey: false });

try {
    var twit_text;
    var extended_tweet;
    var entiti_hashtag;
    var user_url;
    var user_profile_location;
    var user_profile_description;
    var geo_coordinates;
    var place;
    var place_place_type;
    var place_place_name;
    var place_place_full_name;
    var place_place_country;
    var place_place_country_code;
    var i=0;
    var log_data;
    var geo_log_data;
    var user_profile_log_data;
    var network_log;
    var stream = T.stream('statuses/sample', {language: 'en' })
    var data_at;
 
    stream.on('tweet', function (tweet) {
        //var user_geo_info=JSON.stringify(tweet.geo);
      console.log(tweet);
      var d = new Date();
// console.log(d);
 var DD=d.getDate();
 var MM=d.getMonth();
 var YY=d.getFullYear()
    var H = d.getHours();
    var M = d.getMinutes();
    var S = d.getSeconds();
    var MS = d.getMilliseconds()
var date_at=DD+"/"+MM+"/"+YY+"-"+H+":"+M+":"+S+":"+MS;
       //console.log(">>>>"+date_at);
        if(tweet.truncated == false)
        {
        twit_text=tweet.text;
        //console.log("Normal Tweet >>> >>> "+twit_text)
        }
        else
        {
        extended_tweet=tweet.extended_tweet.full_text;
        twit_text=extended_tweet;
        //console.log("Extended Tweet >>> >>>  "+twit_text)
        }
        var twit_createdAt=tweet.created_at;
        var twit_user_id=tweet.user.id;
        var twit_user_name=tweet.user.name;
        var twit_user_screen_name=tweet.user.screen_name;
        var twit_text=tweet.text;
        var twit_source=tweet.source;
       
//        console.log(twit_source);
       
// ###
        var profile_location=tweet.user.location;
            if(profile_location == null) {
            user_profile_location="null"
            }
            else {
            user_profile_location=profile_location;
            //console.log(user_profile_location)
            }
        var user_profile_data=tweet.user.description;
            if(user_profile_data == null) {
            user_profile_description="null"
            }
            else {
            user_profile_description=user_profile_data;
            //console.log(user_profile_description)
            }
        var user_profile_url=tweet.user.url;
            if(user_profile_url == null) {
            user_url ="null";
           
            }
            else {
            user_url=tweet.user.url;
            //console.log(user_url)
            }


        var geo_null=tweet.geo;
            if(geo_null == null){
            geo_coordinates="null"
            }
            else {
            geo_coordinates=tweet.geo.coordinates;
            console.log(geo_coordinates);
            }
        var twit_place=tweet.place;
            if(twit_place == null) {
             place="null";
             place_place_type="null";
             place_place_name="null";
             place_place_full_name="null";
             place_place_country="null";
             place_place_country_code="null";
            }
            else {   
                place_place_type=tweet.place.place_type;
                place_place_name=tweet.place.name;
                place_place_full_name=tweet.place.full_name;
                place_place_country=tweet.place.country;
                place_place_country_code=tweet.place.country_code;
                //console.log(place_place_type+" "+place_place_name+" "+place_place_full_name+" "+place_place_country+"                     "+place_place_country_code);   
            }
/* Code for Twitter Entities */
        var entiti_hashtag_count=tweet.entities.hashtags.length;
        var entiti_hashtag_set=[];
            if(entiti_hashtag_count > 0)
            {
                for(i=0;i<entiti_hashtag_count;i++)
                {
                //console.log(tweet.entities.hashtags[i].text);
                entiti_hashtag=tweet.entities.hashtags[i].text;
                //console.log(entiti_hashtag)
                entiti_hashtag_set.push(entiti_hashtag);
                }
            //console.log(entiti_hashtag_set)
            }
/* END of Code for Twitter Entities  END*/
        var timestamp=tweet.timestamp_ms;
        //console.log(timestamp);


// /* NOW PUT ALL THE DATA IN DB */
        var tweetdatas_db = mongoose.model('public_stream_2', tdata);
        var put_data_todb = new tweetdatas_db ({
             created_at:twit_createdAt,
             created_timestamp:timestamp,
             //user_ISO_Date:{type:Date, default:Date.now},
        //user profile info under user: {}
             user_Id:twit_user_id,
             user_name:twit_user_name,
             user_screenname:twit_user_screen_name,
             user_url:user_url,
             user_description:user_profile_description,
             user_profile_location:user_profile_location,
             user_text:twit_text,
             user_hashtag:entiti_hashtag_set,
             user_source:twit_source,
       
        //End of user Profile info under user: {}
             user_geo:geo_coordinates,
             user_place_type:place_place_type,
             user_place_name:place_place_name,
             user_place_full_name:place_place_full_name,
             user_country_code:place_place_country_code,
             user_country_name:place_place_country,
                     created_timestamp:timestamp
          });
          
            put_data_todb.save(function(error, doc) {
                if(!error) {
               // console.log(i++ +"th >> "+date_at);
                }
                else {
                //console.log("error in saving file");
                }
            });
            
           // END of DB Data STORAGE//////////////////
pub_log_data= date_at+'\t'+twit_user_id+'\t'+twit_user_name+'\t'+twit_user_screen_name+'\t'+user_url+'\t'+user_profile_location+'\t'+twit_source+'\n'
//geo_log_data =  date_at+'\tUser_id:'+twit_user_id+'\tName:'+twit_user_name+'\tUser Name:'+twit_user_screen_name+'\tLat:'+geo_coordinates[0]+'\tLon:'+geo_coordinates[1]+'\t Place Name:'+place_place_name+'\n'
//user_profile_log_data= date_at+'\t User_id:'+twit_user_id+'\tName:'+twit_user_name+'\t User Name:'+twit_user_screen_name+'\n'
geo_log_data =  date_at+'\t'+twit_user_id+'\t'+twit_user_name+'\t'+twit_user_screen_name+'\t'+geo_coordinates[0]+'\t'+geo_coordinates[1]+'\t'+place_place_name+'\n'
user_profile_log_data= date_at+'\t' +twit_user_id+'\t'+twit_user_name+'\t'+twit_user_screen_name+'\n'
           // ##################### LOGGING PHASE #################//'
fs.appendFile('./data_log/public_stream.log', pub_log_data, function (err) {
  if (err) throw err;
  //console.log('Public Log Updated!');
}); 
           // #####################END OF LOGGING PHASE ###########//
        //%%%%%%%%%PASSS DATA TO MicroService%%%%%%%%%%%USER_PROFILE%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
            try {
                     fs.appendFile('./data_log/user_profile_1.log', user_profile_log_data, function (err) {
                            if (err) throw err;
                            //console.log('User_Profile log Updated!');
                    });
            var options = {
              host: '192.168.1.3',
              port: 2020,
              path: '/'+twit_user_id+'/'+twit_user_screen_name
                       };

                    http.get(options, function(resp){
                      resp.on('data', function(chunk){
                        //do something with chunk
                      });
                    }).on("error", function(e){
                     // console.log("Got error: " + e.message);
                    });
          }
                      catch(ex)
                      {
                        console.log(ex);
                      }
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
        //%%%%%%%%%PASSS DATA TO MicroService%%%%%%%%%%%USER_geo_WALK_PROFILE%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

        if (geo_coordinates != "null") {

                    fs.appendFile('./data_log/user_geowalk.log', geo_log_data, function (err) {
                      if (err) throw err;
                      console.log('Geo Log Updated!');
                    });

                try {
             
                    var options = {
                        host: '192.168.1.4',
                        port: 2021,
                        path: '/'+twit_user_id+'/'+twit_user_screen_name+'/'+geo_coordinates
                    };

                    http.get(options, function(resp){
                      resp.on('data', function(chunk){
                        //do something with chunk
                      });
                    }).on("error", function(e){
                     // console.log("Got error: " + e.message);
                    });
                  }
                catch(ex)
                  {
                    console.log(ex);
                  }
          }
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
         //%%%%%%%%%PASSS DATA TO MicroService%%%%%%%%%%%Venue_Search%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
        if (geo_coordinates != "null") {


                try {
             
                    var options = {
                        host: '192.168.1.5',
                        port: 2022,
                        path: '/'+geo_coordinates
                    };

                    http.get(options, function(resp){
                      resp.on('data', function(chunk){
                        //do something with chunk
                      });
                    }).on("error", function(e){
                     // console.log("Got error: " + e.message);
                    });
                  }
                catch(ex)
                  {
                    console.log(ex);
                  }
          }
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//



        /*
            put_data_todb.save(function(error, doc) {
                if(!error) {
                console.log(i++ +"th >> "+data_at);
                }
                else {
                //console.log("error in saving file");
                }
            });
            */
           





});
}
catch(ex) {
console.log(ex);
stream.on('reconnect', function (request, response, connectInterval) {
        network_log=data_at+" NETWORK DOWN : TRYING TO CONNECT 1 +\n"
        fs.appendFile('./data_log/network_log.log', network_log, function (err) {
                            if (err) throw err;
                            console.log('NETWORK Log Updated!');
                          });


console.log("TRYING TO CONNECT 1");
})
}

stream.on('reconnect', function (request, response, connectInterval) {
        network_log=data_at+" NETWORK DOWN : TRYING TO CONNECT 2 \n"
          fs.appendFile('./data_log/network_log.log', network_log, function (err) {
                              if (err) throw err;
                              console.log('NETWORK Log Updated!');
                            });
console.log("TRYING TO CONNECT 2");
})
