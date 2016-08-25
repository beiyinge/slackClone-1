var express = require('express');
var app=express();
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var mime = require('mime');
var bodyParser = require("body-parser");
var formidable = require('formidable');
var path = require('path');

app.use(bodyParser.json());


var dbFile=require ('./db.js');


var filename = 'testSlack.db';

dbFile.createDB(filename);
var db = new sqlite3.Database(filename);

app.get('/', function(req, res) {
	res.redirect('slack.html');
});

app.get('/channel/user/:id', function (req, res) {
//	var userId = parseInt(req.param('id')); A.Yuk
	var userId = parseInt(req.params.id);	
	getChannelsForUser(userId, function(err, channels) {
	
		res.send(channels);
	});
});

// app.get("/uploads/:filename", function (req, res) {
// 	var file = __dirname + '/uploads/' + req.params.filename;
// 	var mimetype = mime.lookup(file);
// 	console.log(mimetype);
//   	res.download(file); 
// });

app.get("/avatar/:userName", function (req, res) {
	getIntUserIdByUsername(req.params.userName, function(err, data) {
	
		var userId = data;
		//console.log(userId);
		var file = __dirname + '/webapp/avatar/' + userId % 3 + '.jpg';
		fs.exists(file, function(exists){
      		if (exists) {     
				// Content-type is very interesting part that guarantee that
				// Web browser will handle response in an appropriate manner.
        		fs.createReadStream(file).pipe(res);
      		} else {
        		fs.createReadStream(__dirname + '/webapp/avatar/0.jpg').pipe(res);
      		}
		});
	});
});

app.get('/message/channel/:id', function (req, res) {
//	var userId = req.param('id'); // A Yuk revision for deprecated 
 	var userId = req.params.id; 
 	getMsgForChannel(userId, function(err, messages) {
		res.send(messages);
	});
});

app.get('/user/checkuser', function (req, res) {
//	var username = req.param('username');
	
	var username = req.query.username;
	getUserIdByUsername(username, function(err, data) {
	
	 	res.send(data);
	});
});

app.get('/user/login', function (req, res) {

	//var username = req.param('username'); // A Yuk revision for deprecated 
	//var password = req.param('password'); // A Yuk revision for deprecated 
  	var username = req.query.username;
 	var password = req.query.password;
	getUserIdByUsernamePassword(username, password, function(err, data) {
		
	 	res.send(data);
	});
});

app.post('/user/signup', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	
	
	signupUser(username, password, email, function(err) {
		getUserIdByUsername(username, function(err, data){
			res.send(data);
		});
	});
});

app.get('/user/user/:id', function (req, res) {
//	var userId = parseInt(req.param('id')); A. Yuk
	var userId = parseInt(req.params.id);	
	dbFile.getUserNameFromID(db, userId).then ((val)=> {
		
		res.send (val);
	
	}).catch((err)=>{
		res.send("");
		
	});

	
});

app.get('/currentTeams/:userId', function (req, res) {

//	var userId = parseInt(req.param('userId'));
	var userId = parseInt(req.params.userId);

	dbFile.getTeamsForUser(db, userId).then ((val)=> {
		
		res.send (val);
		
	}).catch((err)=>{
		res.send("");
		
	});	
});

app.get('/team/team', function (req, res) {
	
	dbFile.getTeams(db).then ((val)=> {
		res.send (val);
		
	}).catch((err)=>{
		 
		res.send(err+"       :::: /team/team/  error .......");
	
	});

	
});


app.get('/user/allUsers/:id', function (req, res) {
	
//	var userId = parseInt(req.param('id')); A.Yuk
	var userId = parseInt(req.params.id);
	
	dbFile.getAllUsersInTeam(userId,db).then ((val)=> {
	
		res.send (val);
		
	}).catch((err)=>{
		res.send("");

	});

	
});


app.get ('/channel/privChannel/exists/:userId/:chatId', function (req, res){
	
	var userId = parseInt(req.params.userId);
	var chatId=parseInt(req.params.chatId);
		
	dbFile.getExistingPrivateChannel(userId, chatId ,db).then ((val)=> {
		
		res.send (val);
		
	}).catch((err)=>{
		
		res.send("");
	
	});
});


app.get ('/channel/privateChannel/:id', function (req, res){
	//var userId = parseInt(req.param('id'));
	var userId = parseInt(req.params.id);
	
	dbFile.getChannelsForPrivate(userId,db).then ((val)=> {
		
		res.send (val);
		
	}).catch((err)=>{
		res.send("");
	
	});
});


app.get('/allusers', function (req, res) {
	
	dbFile.getAllUserNames(db).then ((val)=> {
		res.send (val);
		
	}).catch((err)=>{
		res.send("");

	});

	
});

app.get('/channel/channel', function (req, res) {
	
	dbFile.getChannels(db).then ((val)=> {
		
		res.send (val);
	}).catch((err)=>{
		res.send("");
	
	});

	
});

app.post('/channel/private/change', function (req, res){
	var channelId = parseInt(req.body.channelId);
	var bShow=parseInt(req.body.bShow)
		
	dbFile.changePrivChat(channelId,bShow,db).then ((val)=> {
	
		res.send ("");
		
	}).catch((err)=>{
	
		res.send("");
	
	});
});






app.post('/message/message', function (req, res){
	
	var userId=parseInt(req.body.userId);
	var channelId=parseInt(req.body.channelId);
	var msg=req.body.msg;
	

	dbFile.InsertMsgData(msg,channelId,userId, db).then ((val)=>{
		res.send(val);
	}).catch((err)=>{
		res.send("");
	});
});



app.post('/team/newTeam', function (req, res){
	var teamName=req.body.teamName;
	
	dbFile.InsertTeamData(teamName, db).then ((val)=>{
		res.send(val);
	}).catch((err)=>{
		res.send("");
		
	});
});

app.post('/channel/uploadFile', function(req, res){

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

	var channelName=req.body.channelName;
	var desc=req.body.desc;
	var teamId=parseInt(req.body.teamId);
	var type=req.body.type;



	dbFile.InsertChannelData(channelName,  teamId, desc, type, db).then ((val)=>{
		res.send(val);
	}).catch((err)=>{
		res.send("");
	
	});
});




app.post('/team/privateChannel', function (req, res){
	var userId=parseInt(req.body.userId);
	var privChatUserId=parseInt(req.body.privChatUserId);
	var userName=req.body.userName;
	var privChatUserName=req.body.privChatUserName;


	dbFile.InsertPrivChannelData(userId, userName , privChatUserId, privChatUserName, db).then ((val)=>{
		
		res.send(val);
	}).catch((err)=>{
		res.send("");
		
	});
});



app.post('/team/user/', function (req, res){

	var teamId=parseInt(req.body.teamId);
	var userId=parseInt(req.body.userId);

	dbFile.InsertTeamUsers(userId, teamId, db).then ((val)=>{

		res.setHeader("Content-Type", "application/json");
	
		res.send();
	}).catch((err)=>{
		res.send();
		
	});
	
});



app.use(express.static(__dirname + '/webapp'));

var server = app.listen(3000, function () {

	var port = server.address().port;
  	console.log("Express app server listening at localhost:", port);

});



function getChannelsForUser (userid, callBack){
 	var query = "SELECT DISTINCT CHANNELS.NAME, CHANNELS.ID FROM CHANNELS  " +
        "INNER JOIN TEAMUSERS ON TEAMUSERS.TEAMID = CHANNELS.TEAMID " +
        "WHERE USERID = " + userid + " AND TYPE <>'P' ORDER BY NAME";
    
	var channels = [];

    db.serialize(function() {
        db.each(
            query, 
            function(err, row) {
            	
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

function getIntUserIdByUsername (username, callBack){

 	var sql = "SELECT USERID FROM USERS where " + 
            "LOWER(NAME) = '" + username.toLowerCase() + "'";
       	   
   	var userid;

    db.serialize(function() {
        db.each(
            sql, 
            function(err, row) { 
            	
        		userid = row.USERID;
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
            
            },
            function (err) {
				callBack(err);	
           }
        );
    });

 };