/* ######################Twitter code begins###############*/

/* THIS FILE IS FOR GETTING PUBLIC STREAM */
var Twit = require('twit');
var mongoose = require('mongoose');
var request = require('request');
var http = require('http');
var fs = require('fs');
require('custom-env').env('aws')

require('dotenv').config();
console.log(process.env.FOO);
//console.log(process.env.consumer_key);
var T = new Twit({
  consumer_key: process.env.consumer_key
  , consumer_secret: process.env.consumer_secret
  , access_token: process.env.access_token
  , access_token_secret: process.env.access_token_secret
});


var tweetdataSchema = mongoose.Schema;
var tdata = new tweetdataSchema({
  created_at: String,
  created_timestamp: Number,
  user_ISO_Date: { type: Date, default: Date.now },
  user_text: String,
  user_hashtag: [],
  user_source: String,
  //user profile info under user: {}
  user_Id: String,
  user_name: String,
  user_screenname: String,
  user_location: String,
  user_url: String,
  user_description: String,
  User_profile_location: String,
  //End of user Profile info under user: {}
  user_geo: [],
  user_place_type: String,
  user_place_name: String,
  user_place_full_name: String,
  user_country_code: String,
  user_country_name: String
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
  var i = 0;
  var log_data;
  var geo_log_data;
  var user_profile_log_data;
  var network_log;
  var stream = T.stream('statuses/sample', { language: 'en' })
  var data_at;

  stream.on('tweet', function (tweet) {
    //var user_geo_info=JSON.stringify(tweet.geo);
    //       console.log(tweet);
    var d = new Date();
    // console.log(d);
    var DD = d.getDate();
    var MM = (d.getMonth() + 1);
    var YY = d.getFullYear()
    var H = d.getHours();
    var M = d.getMinutes();
    var S = d.getSeconds();
    var MS = d.getMilliseconds()
    var date_at = DD + "/" + MM + "/" + YY + "-" + H + ":" + M + ":" + S + ":" + MS;

    if (tweet.truncated == false) {
      twit_text = tweet.text;
      //console.log("Normal Tweet >>> >>> "+twit_text)
    }
    else {
      extended_tweet = tweet.extended_tweet.full_text;
      twit_text = extended_tweet;
      //console.log("Extended Tweet >>> >>>  "+twit_text)
    }
    var twit_createdAt = tweet.created_at;
    var twit_user_id = tweet.user.id;
    var twit_user_name = tweet.user.name;
    var twit_user_screen_name = tweet.user.screen_name;
    var twit_text = tweet.text;
    var twit_source = tweet.source;

    //        console.log(twit_source);

    // ###
    var profile_location = tweet.user.location;
    if (profile_location == null) {
      user_profile_location = "null"
    }
    else {
      user_profile_location = profile_location;
      //console.log(user_profile_location)
    }
    var user_profile_data = tweet.user.description;
    if (user_profile_data == null) {
      user_profile_description = "null"
    }
    else {
      user_profile_description = user_profile_data;
      //console.log(user_profile_description)
    }
    var user_profile_url = tweet.user.url;
    if (user_profile_url == null) {
      user_url = "null";

    }
    else {
      user_url = tweet.user.url;
      //console.log(user_url)
    }


    var geo_null = tweet.geo;
    if (geo_null == null) {
      geo_coordinates = "null"
    }
    else {
      geo_coordinates = tweet.geo.coordinates;
      console.log(geo_coordinates);
    }
    var twit_place = tweet.place;
    if (twit_place == null) {
      place = "null";
      place_place_type = "null";
      place_place_name = "null";
      place_place_full_name = "null";
      place_place_country = "null";
      place_place_country_code = "null";
    }
    else {
      place_place_type = tweet.place.place_type;
      place_place_name = tweet.place.name;
      place_place_full_name = tweet.place.full_name;
      place_place_country = tweet.place.country;
      place_place_country_code = tweet.place.country_code;
      //console.log(place_place_type+" "+place_place_name+" "+place_place_full_name+" "+place_place_country+"                     "+place_place_country_code);   
    }
    /* Code for Twitter Entities */
    var entiti_hashtag_count = tweet.entities.hashtags.length;
    var entiti_hashtag_set = [];
    if (entiti_hashtag_count > 0) {
      for (i = 0; i < entiti_hashtag_count; i++) {
        //console.log(tweet.entities.hashtags[i].text);
        entiti_hashtag = tweet.entities.hashtags[i].text;
        //console.log(entiti_hashtag)
        entiti_hashtag_set.push(entiti_hashtag);
      }
      //console.log(entiti_hashtag_set)
    }
    /* END of Code for Twitter Entities  END*/
    var timestamp = tweet.timestamp_ms;
    //console.log(timestamp);


    pub_log_data = date_at + '\t' + twit_user_id + '\t' + twit_user_name + '\t' + twit_user_screen_name + '\t' + user_url + '\t' + user_profile_location + '\t' + twit_source + '\n'
    geo_log_data = date_at + '\tUser_id:' + twit_user_id + '\tName:' + twit_user_name + '\tUser Name:' + twit_user_screen_name + '\tLat:' + geo_coordinates[0] + '\tLon:' + geo_coordinates[1] + '\t Place Name:' + place_place_name + '\n'
    user_profile_log_data = date_at + '\t User_id:' + twit_user_id + '\tName:' + twit_user_name + '\t User Name:' + twit_user_screen_name + '\n'
    // ##################### LOGGING PHASE #################//'
    fs.appendFile('./data_log/public_stream.log', pub_log_data, function (err) {
      if (err) throw err;
      console.log('Public Log Updated!');
    });

    /*
    ######################################################################################################################################
    # The below code is tosend data to the user-profile microservices #
    ######################################################################################################################################
    */
     try {
                     fs.appendFile('./data_log/user_profile.log', user_profile_log_data, function (err) {
                            if (err) throw err;
                            console.log('User_Profile log Updated!');
                    });
            var options = {
              protocol:'http:',
              host: process.env.MS_USER_PROFILE_HOST,
              port: process.env.MS_USER_PROFILE_PORT,
              path: '/'+twit_user_id+'/'+twit_user_screen_name
	       };

                    http.get(options, function(resp, err){
                     console.log("w1")
                      resp.on('data', function(chunk){
                        //do something with chunk
                        console.log("w2")
                      });
                    }).on("error", function(e){
                      console.log("Got error: " + e.message);
                    });
          }
                      catch(ex)
                      {
                        console.log(ex);
                      }
      /*
      ####END of User-profile microservice#####################################################################################################
      */





  });
}
catch (ex) {
  console.log(ex);
  stream.on('reconnect', function (request, response, connectInterval) {
    network_log = data_at + " NETWORK DOWN : TRYING TO CONNECT 1 +\n"
    fs.appendFile('./data_log/network_log.log', network_log, function (err) {
      if (err) throw err;
      console.log('NETWORK Log Updated!');
    });


    console.log("TRYING TO CONNECT 1");
  })
}

stream.on('reconnect', function (request, response, connectInterval) {
  network_log = data_at + " NETWORK DOWN : TRYING TO CONNECT 2 \n"
  fs.appendFile('./data_log/network_log.log', network_log, function (err) {
    if (err) throw err;
    console.log('NETWORK Log Updated!');
  });
  console.log("TRYING TO CONNECT 2");
})

