var express = require('express');
var app=express();
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var bodyParser = require("body-parser");
var formidable = require('formidable');
var path = require('path');

app.use(bodyParser.json());


var dbFile=require ('./db.js');

//app.use(bodyParser.urlencoded({ extended: false }));

//var dbHandler=require ('db.js');
var filename = 'testSlack.db';

dbFile.createDB(filename);
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
	
	getUserIdByUsernamePassword(username, password, function(err, data) {
		//console.log(err);
	 	res.send(data);
	});
});

app.post('/user/signup', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	
	//res.end("yes");
	signupUser(username, password, email, function(err) {
		getUserIdByUsername(username, function(err, data){
			res.send(data);
		});
	});
});

app.get('/user/user/:id', function (req, res) {
	var userId = parseInt(req.param('id'));
	
	dbFile.getUserNameFromID(db, userId).then ((val)=> {
		
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get user name");
	//	db.close();
	});

	
});

app.get('/currentTeams/:userId', function (req, res) {
	//var userIdp = req.param('userId').substr(1);	
	//var userId = parseInt(userIdp);	
	var userId = parseInt(req.param('userId'));

	dbFile.getTeamsForUser(db, userId).then ((val)=> {
		
		res.send (val);
		
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get teams");	
	});	
});

app.get('/team/team', function (req, res) {
	
	dbFile.getTeams(db).then ((val)=> {
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get team  names");
	//	db.close();
	});

	
});


app.get('/user/allUsers/:id', function (req, res) {
	
	var userId = parseInt(req.param('id'));

	
	dbFile.getAllUsersInTeam(userId,db).then ((val)=> {
		console.log(" got all users on my team " + val);
		
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get team user names: "+ err) ;
	//	db.close();
	});

	
});

app.get ('/channel/privateChannel/:id', function (req, res){
	var userId = parseInt(req.param('id'));

	
	dbFile.getChannelsForPrivate(userId,db).then ((val)=> {
		console.log(" got all private chats " + val);
		
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get private chats: "+ err) ;
	//	db.close();
	});
});


app.get('/allusers', function (req, res) {
	
	dbFile.getAllUserNames(db).then ((val)=> {
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get user names");
	//	db.close();
	});

	
});

app.get('/channel/channel', function (req, res) {
	console.log("got to team select");
	
	dbFile.getChannels(db).then ((val)=> {
		
		res.send (val);
		//db.close();
	}).catch((err)=>{
		res.send("");
		console.log ("Unable to get channel  names");
	//	db.close();
	});

	
});



app.post('/message/message', function (req, res){
	console.log ("arrived at server");

	var userId=parseInt(req.body.userId);
	var channelId=parseInt(req.body.channelId);
	var msg=req.body.msg;
	

	dbFile.InsertMsgData(msg,channelId,userId, db).then ((val)=>{
		console.log ("insert message promise OK");
		res.send(val);
	}).catch((err)=>{
		res.send("");
		console.log ("promise rejected");
	});
});



app.post('/team/newTeam', function (req, res){
	console.log ("arrived at server to save new team");

	var teamName=req.body.teamName;
	

	dbFile.InsertTeamData(teamName, db).then ((val)=>{
		console.log ("insert team promise OK");
		res.send(val);
	}).catch((err)=>{
		res.send("");
		console.log ("team insert rejected");
	});
});

app.post('/channel/uploadFile', function(req, res){
	console.log("Get file");
// create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/webapp/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

  res.send("success");
});

app.post('/team/channel', function (req, res){
	console.log ("arrived at server to save new channel");

	var channelName=req.body.channelName;
	var desc=req.body.desc;
	var teamId=parseInt(req.body.teamId);
	var type=req.body.type;

	console.log ("channel name: " + channelName + ", desc: " + desc + ", teamId:" + teamId + ", type: "  + type);

	

	dbFile.InsertChannelData(channelName,  teamId, desc, type, db).then ((val)=>{
		console.log ("insert new channel promise OK");
		res.send(val);
	}).catch((err)=>{
		res.send("");
		console.log ("new channel rejected");
	});
});

app.post('/team/user/', function (req, res){

	var teamId=parseInt(req.body.teamId);
	var userId=parseInt(req.body.userId);

	dbFile.InsertTeamUsers(userId, teamId, db).then ((val)=>{
		console.log ("added userid " + userId + " to teamid " + teamId);
		res.send(val);
	}).catch((err)=>{
		res.send("");
		console.log ("insert into team members failed....");
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
        "WHERE USERID = " + userid + " AND TYPE <>'P' ORDER BY NAME";
    
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
	            	//console.log(row);
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
            "LOWER(NAME) = '" + username.toLowerCase() + "' and PASSWORD = '" + password + "'";
       	   
   	var userid = [];

    db.serialize(function() {
        db.each(
            sql, 
            function(err, row) { 
            	
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
            "LOWER(NAME) = '" + username.toLowerCase() + "'";
       	   
   	var userid = [];

    db.serialize(function() {
        db.each(
            sql, 
            function(err, row) { 
            	
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