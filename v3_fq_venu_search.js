var express = require('express');
var request =require('request');
var app=express();
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var port = 2022;
var host = '192.168.1.5'
app.set('view engine', 'ejs');
mongoose.connect("mongodb://192.168.1.2:27017/fq_venue");
var db =  mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");

 });
 var venueSchema = mongoose.Schema;
 var VenueData = new venueSchema ({
				loc_id:String,
				loc_name:String,
				loc_lat:String,
				loc_lng:String,
				loc_postCode:String,
				loc_country_code:String,
				loc_country:String,
				loc_state:String,
				loc_city:String,

				cat_id:String,
				cat_name:String

				 }, { versionKey: false });
 var fq_token = {
		 Client_id :'TKAF2VNSGELXCYMWXPHA3RIRCH4LHL3CMR1QXVNTOQDI0AUJ',
		 Client_Secret : 'ORASLMI0DRQ0AVXJLWQCL04WINFQWYIHPX5XXOVKC1UX5FMM'
		}
var geo_data 	
app.get('/:geo_data',function(req,res,next){
	 geo_data=req.params.geo_data
	console.log(geo_data);



var dt='20190404'
var req_url = 'https://api.foursquare.com/v2/venues/search?ll='+geo_data+'&client_id='+fq_token.Client_id+'&client_secret='+fq_token.Client_Secret+'&v='+dt
console.log(req_url)
//mgdb Schema
var fqSchema = mongoose.Schema;
var fqdata = new fqSchema({
 loc_id:Number,
 loc_name:String,
 loc_address:String,
 loc_crossStreet:String,
 loc_lat:String,
 loc_lng:String,
 loc_postCode:String,
 loc_country_code:String,
 loc_country:String,
 loc_state:String,
 loc_city:String,
 cat_id:String,
 cat_name:String 
 }, { versionKey: false });
//fq_vars
var loc_id;
var	loc_name;
var	loc_address;
var	loc_crossStreet
var	loc_lat;
var	loc_lng;
var	loc_postCode;
var	loc_country_code;
var	loc_country;
var	loc_state;
var	loc_city;

var	cat_id;
var	cat_name;

//log vars
var venue_log;

request(req_url, function (error, response, body) {
	//console.log(error)
  if (!error && response.statusCode == 200) {
	  	var a=JSON.parse(body)
	  	console.log(a);
	  	var fq_venue=a.response.venues
	  	var venue_length=a.response.venues.length
	    //var c=b.id 
	    console.log(venue_length);
	

  	    //console.log(b.location.address);
  	    
  	    for (i=0;i<venue_length;i++) {
		  	    	loc_id = fq_venue[i].id
		  	    	loc_name =fq_venue[i].name
		  	    	loc_address=fq_venue[i].location.address; //
					//loc_crossStreet=fq_venue[i].location.address
				    loc_lat=fq_venue[i].location.lat;
					loc_lng=fq_venue[i].location.lng;
					loc_postCode=fq_venue[i].location.postalCode;
					loc_country_code=fq_venue[i].location.cc;
					loc_country=fq_venue[i].location.country;
					loc_state=fq_venue[i].location.state;
					loc_city=fq_venue[i].location.city;

					cat_len=fq_venue[i].categories.length;

					
					

					
		  	    	//console.log(fq_venue[i])
		  	    	//console.log(loc_id, loc_name, loc_lat, loc_lng, cat_len, cat_name)
		  	    	
		  	    	if(cat_len > 0)
		  	    		{ 
		  	    		cat_id=fq_venue[i].categories[0].id;
		  	    		cat_name=fq_venue[i].categories[0].name;
		  	    		//console.log(cat_name)
		  	    		//venue_log = 'loc_id:'+loc_id+'\tloc_name:'+loc_name+'\tloc_lat:'+loc_lat+'\tloc_lng:'+loc_lng+'\tloc_postCode:'+loc_postCode+'\tloc_country_code:'+loc_country_code+'\tloc_country:'+loc_country+'\t loc_state:'+loc_state+'\tloc_city:'+loc_city+'\cat_id:'+cat_id+'\tcat_name:'+cat_name+'\n'
		  	    		venue_log = loc_id+'\t'+loc_name+'\t'+loc_lat+'\t'+loc_lng+'\t'+loc_postCode+'\t'+loc_country_code+'\t'+loc_country+'\t'+loc_state+'\t'+loc_city+'\t'+cat_id+'\t'+cat_name+'\n'
		  	    		}
		  	    		else
		  	    		{
		  	    			cat_id='NULL'
		  	    			cat_name='NULL'
		  	    			//venue_log = 'loc_id:'+loc_id+'\tloc_name:'+loc_name+'\tloc_lat:'+loc_lat+'\tloc_lng:'+loc_lng+'\tloc_postCode:'+loc_postCode+'\tloc_country_code:'+loc_country_code+'\tloc_country:'+loc_country+'\t loc_state:'+loc_state+'\tloc_city:'+loc_city+'\cat_id:'+cat_id+'\tcat_name:'+cat_name+'\n'
		  	    			venue_log = loc_id+'\t'+loc_name+'\t'+loc_lat+'\t'+loc_lng+'\t'+loc_postCode+'\t'+loc_country_code+'\t'+loc_country+'\t'+loc_state+'\t'+loc_city+'\t'+cat_id+'\t'+cat_name+'\n'
		  	    		}

		  	    	// Put Data to mgDB
		  	    	var fq_data_db = mongoose.model('venues', VenueData);
        			var put_data_todb = new fq_data_db ({
						 loc_id:loc_id,
						 loc_name:loc_name,
						 loc_address:loc_address,
						 loc_crossStreet:loc_crossStreet,
						 loc_lat:loc_lat,
						 loc_lng:loc_lng,
						 loc_postCode:loc_postCode,
						 loc_country_code:loc_country_code,
						 loc_country:loc_country,
						 loc_state:loc_state,
						 loc_city:loc_city,
						 cat_id:cat_id,
						 cat_name:cat_name 
						 	});
        			put_data_todb.save(function(error, doc){
        					if(!error){
        						console.log("Venue Saved");
        					}
        					else {
        						console.log("Failed to SAVE in DB")
        					}
        			});
		  	    	

		  	    	  fs.appendFile('./data_log/venue_log.log', venue_log, function (err) {
                            if (err) throw err;
                           // console.log('Venue log Updated!');
                    });  
  	   				 } 
  				}
			}); 

});

app.listen(port, host,function (error, response){
	if(!error)
	{
		console.log("fq_venue_search running at "+host+":"+port);
	}

});


/*
 id: '51eabef6498e10cf3aea7942',
  name: 'Brooklyn Bridge Park - Pier 2',
  location: 
   { address: 'Furman St',
     crossStreet: 'Brooklyn Bridge Park Greenway',
     lat: 40.69957016220183,
     lng: -73.99793274204788,
     labeledLatLngs: [ [Object] ],
     distance: 180,
     postalCode: '11201',
     cc: 'US',
     city: 'Brooklyn',
     state: 'NY',
     country: 'United States',
     formattedAddress: 
      [ 'Furman St (Brooklyn Bridge Park Greenway)',
        'Brooklyn, NY 11201',
        'United States' ] },
  categories: 
   [ { id: '4bf58dd8d48988d163941735',
       name: 'Park',
       pluralName: 'Parks',
       shortName: 'Park',
       icon: [Object],
       primary: true } ],
  referralId: 'v-1554622324',
  hasPerk: false }
*/