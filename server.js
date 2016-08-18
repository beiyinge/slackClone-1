var express = require('express');
var app=express();
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var bodyParser = require("body-parser");

app.use(bodyParser.json());


var dbFile=require ('./db.js');

//app.use(bodyParser.urlencoded({ extended: false }));

//var dbHandler=require ('db.js');
var filename = 'testSlack.db';
var db = new sqlite3.Database(filename);

app.get('/channel/user/:id', function (req, res) {
	var userId = parseInt(req.param('id'));
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

app.get('/user/checkuser', function (req, res) {
	var username = req.param('username');
	getUserIdByUsername(username, function(err, data) {
		//console.log(err);
	 	res.send(data);
	});
});

app.get('/user/login', function (req, res) {
	var username = req.param('username');
	var password = req.param('password');
	console.log(username + " " + password);
	getUserIdByUsernamePassword(username, password, function(err, data) {
		//console.log(err);
	 	res.send(data);
	});
});

app.post('/user/signup', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	console.log(username + " " + password + " " + email);
	//res.end("yes");
	signupUser(username, password, email, function(err) {
		getUserIdByUsername(username, function(err, data){
			res.send(data);
		});
	});
});

app.get('/user/user/:id', function (req, res) {
	var userId = parseInt(req.param('id'));
	console.log ("user id : " + userId);

	dbFile.getUserNameFromID(db, userId).then ((val)=> {
		console.log ("user name : " + val);
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get user name");
	//	db.close();
	});

	
});


app.post('/message/message', function (req, res){
	console.log ("arrived at server");

	var userId=parseInt(req.body.userId);
	var channelId=parseInt(req.body.channelId);
	var msg=req.body.msg;
	console.log (msg);

	dbFile.InsertMsgData(msg,channelId,userId, db).then ((val)=>{
		console.log ("insert message promise OK");
		res.send(val);
	}).catch((err)=>{
		res.send("");
		console.log ("promise rejected");
	});
});

app.post('/channel/channel', function (req, res){
	console.log ("arrived at server");

	var userId=parseInt(req.body.userId);
	var channelName=parseInt(req.body.channelName);
	

	// dbFile.InsertChannelData(msg,channelId,userId, db).then ((val)=>{
	// 	console.log ("insert message promise OK");
	// 	res.send(val);
	// }).catch((err)=>{
	// 	res.send("");
	// 	console.log ("promise rejected");
	// });
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

function getUserIdByUsernamePassword (username, password, callBack){

 	var sql = "SELECT USERID FROM USERS where " + 
            "NAME = '" + username + "' and PASSWORD = '" + password + "'";
       	   
   	var userid = [];

    db.serialize(function() {
        db.each(
            sql, 
            function(err, row) { 
            	console.log(row);
        		userid.push({'userId':row.USERID});
            },
            function (err) {
				callBack(err, userid);	
           }
        );
    });
};

function getUserIdByUsername (username, callBack){

 	var sql = "SELECT USERID FROM USERS where " + 
            "NAME = '" + username + "'";
       	   
   	var userid = [];

    db.serialize(function() {
        db.each(
            sql, 
            function(err, row) { 
            	console.log(row);
        		userid.push({'userId':row.USERID});
            },
            function (err) {
				callBack(err, userid);	
           }
        );
    });
};

function signupUser (username, password, email, callBack){

 	var sql = "insert into USERS(NAME, PASSWORD, EMAIL) values('" + 
            username + "','" + password + "','" + email + "')";

    db.serialize(function() {
        db.each(
            sql, 
            function(err) { 
            	//console.log(row);
        		//userid.push({'userId':row.USERID});
            },
            function (err) {
				callBack(err);	
           }
        );
    });

 };