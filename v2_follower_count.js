/* THIS FILE IS FOR GETTING PUBLIC STREAM
AIMED FOR <NEW YEAR TWEETS> ALL OVER THE WORLD
*/
var Twit = require('twit');
var fs = require('fs');
//var mongoose = require('../v1/mongoose');
var T = new Twit({
    consumer_key:"IJAv6ve6vlz5c1HjFWog4CLJN"
  , consumer_secret:"ZxcnNgP9mptHoCkBOUFVd601WsmwcVI7wLa2oaFLGeagPcSX3Q"
  , access_token:"276540042-I7dM1NF7XnD8GUDNGDaJtnUErxODM6WBXxFHpo6V"
  , access_token_secret:"IKhlysJxKlRqkZcMRi4HDSsaIsnWxS4XsoizpCimSrkAA"
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
 
//instragram access token 3538228122.1677ed0.4a67138571f74a8e934dc6cfab8dcf81

   // var stream = T.stream('statuses/sample', {language: 'en' })
   
 var follower_count= T.get('users/show', { screen_name: 'imranbe' },  function (err, data, response) {
            //console.log(data)
            var user_id = data.id;
            var user_name = data.screen_name;
            var following_count = data.friends_count;
            var followers_count = data.followers_count;
            var favourites_count = data.favourites_count;
            //user_id, User_name, followers, following, favourites
	        console.log(user_id+'\t'+user_name+'\t'+followers_count+'\t'+following_count+'\t'+favourites_count);
	        user_f_count=user_id+'\t'+user_name+'\t'+followers_count+'\t'+following_count+'\t'+favourites_count
	        fs.appendFile('./data_log/user_f_count.log', user_f_count, function (err) {
  					if (err) throw err;
 					 //console.log('Public Log Updated!');
			}); 


        })