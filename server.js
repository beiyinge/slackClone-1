var express = require('express');
var app=express();
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

//var dbHandler=require ('db.js');
var filename = 'testSlack.db';
var db = new sqlite3.Database(filename);

app.get('/channel/user/:id', function (req, res) {
	var userId = req.param('id');
	getChannelsForUser(userId, function(err, channels) {
		res.send(channels);
	});
});

app.get('/message/channel/:id', function (req, res) {
	var userId = req.param('id');
	getMsgForChannel(userId, function(err, messages) {
		res.send(messages);
	});
});

app.use(express.static(__dirname + '/webapp'));

var server = app.listen(3000, function () {

	var port = server.address().port;
  	console.log("Express app server listening at localhost:", port);

});

// getChannelsForUser(1, function(err, data){
// 	console.log(data);
// });

function getChannelsForUser (userid, callBack){
 	var query = "SELECT DISTINCT CHANNELS.NAME, CHANNELS.ID FROM CHANNELS  " +
        "INNER JOIN TEAMUSERS ON TEAMUSERS.TEAMID = CHANNELS.TEAMID " +
        "WHERE USERID = " + userid + " ORDER BY NAME";
    
	var channels = [];

    db.serialize(function() {
        db.each(
            query, 
            function(err, row) {
            	//console.log(row);
            	channels.push({id: row.ID, name: row.NAME}); 
            },
            function (err) {
                callBack(err, JSON.stringify(channels));
            }
        );
    });
 };

 function getMsgForChannel (channel, callBack){

     var sql = "SELECT USERS.NAME, MSG, TIMESTAMP FROM MESSAGE " + 
            "INNER JOIN USERS ON MESSAGE.USERID=USERS.USERID " +
            "WHERE MESSAGE.CHANNELID = " + channel + " ORDER BY MESSAGE.TIMESTAMP, USERS.NAME";
        
     
      var msg = [];
	   
	    db.serialize(function() {
	        db.each(
	            sql, 
	            function(err, row) { 
	            	console.log(row);
            		msg.push({"userName":row.NAME, "date":row.TIMESTAMP, "msg":row.MSG});
	            },
	            function (err) {
					callBack(err, JSON.stringify(msg));	
	           }
	        );
	    });
 };