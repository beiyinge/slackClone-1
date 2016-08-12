var express = require('express');
var app=express();
var sqlite3 = require('sqlite3').verbose();
var assert = require('assert');
var db=require ('../db.js');
var chai=require("chai");
var chaiAsPromised=require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var filename="testSlack.db"


//db.createDB(filename);

 var dbTest=  new sqlite3.Database(filename);


//function PropData(){
    

  //db.InsertTeamData ("IronYard", dbTest);
//db.InsertTeamData('SSA Boot Camp', dbTest); 
  
    //  db.InsertUserData('Zedong', 'abcd', 'zedong@gmail.com', dbTest);
    //  db.InsertUserData('Chedva', 'pswd', 'cb@gmail.com', dbTest);
    //  db.InsertUserData('Brian', 'zyxw', 'brian@yahoo.com', dbTest);

//     db.InsertTeamUsers("(SELECT USERID FROM USERS WHERE NAME = 'Zedong')","(SELECT TEAMID FROM TEAM WHERE NAME ='IronYard')", dbTest);
//  db.InsertTeamUsers("(SELECT USERID FROM USERS WHERE NAME = 'Chedva')" , "(SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard')", dbTest);                    
    
//    db.InsertChannelData('4Week', "(SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard')", 'this is the channel for the 4 week boot camp', 'T', dbTest);
//     db.InsertChannelData('General', "(SELECT TEAMID FROM TEAM WHERE NAME = 'IronYard')", 'this is the channel for the all boot camps', 'A', dbTest);
    // dbTest.run("DELETE FROM MESSAGE");
   // db.InsertMsgData("This is a test", "(SELECT ID FROM CHANNELS WHERE NAME = '4Week')","(SELECT USERID FROM USERS WHERE NAME = 'Zedong')", dbTest );
   // db.InsertMsgData("This is another test", "(SELECT ID FROM CHANNELS WHERE NAME = '4Week')","(SELECT USERID FROM USERS WHERE NAME = 'Chedva')", dbTest );   
   
    
// }

// PropData();


describe("DB module",()=>{

    // beforeEach(()=>{
    //    // PropData();

    // });
    // afterEach(()=>{
    //     dbTest.rollback;
    // });
  
   
    it('given team name, return all channel names from team',(done)=>{
       
        var team = '11';
        var expected=JSON.stringify([{'channel':'4Week'}, {'channel':'General'}]);
        console.log ("expected - " + expected);
        //var expected=['4Week','General'];
        db.getChannelsFromTeam(dbTest,team).should.eventually.equal(expected).notify(done);
       
        
//         var actual =db.getChannelsFromTeam(dbTest, teamName).then ((val)=> {

//             console.log ("expected: " + expected[0] + "--actual: " + actual[0])
//             assert(actual,expected);
//             done();

//         }).catch((err)=>{
//             console.log ("Unable to get channels from team name");
//     });
  
// // //;
// //     //    assert(actual,expected);
// //     //     done();
//     });
//    it('given team name, return all channel names from team', function (done){
//        var teamName = 'IronYard';
//        var expected=[{"channel":"4Week"}, {"channel":"General"}];
//        //var expected=['4Week', 'General'];
//        db.getChannelsFromTeam(dbTest, teamName).then (
//       function (val) {
//         console.log (val);
//        try {
//        assert.deepEqual(val,expected);
//        done();
//         //res.send (val);
//         //db.close();
//        }catch (err){
//                console.log ('in done try err, '+ err);
//            }
//    },
//    function (err) {
//            done(err);
//        }
//     );
//;
       //assert("actual",expected);
       //done();
   });

//     //----------------------------------------
    it('given channel, return all users',(done)=>{
        var channel = 1;
        var expected=[{'name':'Brian'}, {'name':'Chedva'},{'name':'Zedong'}];
        db.getUsersFromChannel(dbTest,channel).should.eventually.equal(expected).notify(done);
        // var actual =db.getUsersFromChannel(dbTest, channel).then ((val)=> {
        //     assert(actual,expected);
        //     done();
        // }).catch((err)=>{
        //     console.log ("Unable to get channels from user name");
        // });
    });


//     //--------------------------------------

it('given user, get channels',(done)=>{
       
        var userName = 1;
        var expected=[{'channel:':'4Week'}, {'channel':'General'}];

         db.getChannelsForUser(dbTest,userName).should.eventually.equal(expected).notify(done);
//         var actual =db.getChannelsForUser(dbTest, userName).then ((val)=> {
// 		console.log (val);
// 		//res.send (val);
// 		//db.close();
// 	}).catch((err)=>{
// 		//res.send("");
// 		console.log ("Unable to get channels from team name");
// 		//db.close();
// 	});
// //;
//         assert(actual,expected);
//         done();
    });





//     //--------------------------------------------


it('given user name, return teams',(done)=>{
       
        var userName = 'Zedong';
        var expected=[{'team:':'IronYard'}];
        db.getTeamsForUser(dbTest,userName).should.eventually.equal(expected).notify(done);
//         var actual =db.getTeamsForUser(dbTest, userName).then ((val)=> {
// 		console.log (val);
// 		//res.send (val);
// 		//db.close();
// 	}).catch((err)=>{
// 		//res.send("");
// 		console.log ("Unable to get channels from team name");
// 		//db.close();
// 	});
// //;
//         assert(actual,expected);
//         done();
    });

//     //-----------------------------------------------------------



it('given channel, get all msgs',(done)=>{
       
        var channel = '4Week';
        var expected=[{'msg:':'This is a test'}, {'msg':'This is another test'}];

         db.getMsgForChannel(dbTest,channel).should.eventually.equal(expected).notify(done);
//         var actual =db.getMsgForChannel(dbTest, channel).then ((val)=> {
// 		console.log (val);
// 		//res.send (val);
// 		//db.close();
// 	}).catch((err)=>{
// 		//res.send("");
// 		console.log ("Unable to get channels from team name");
// 		//db.close();
// 	});
// //;
//         assert(actual,expected);
//         done();
    });


//     //--------------------------------------------

it('add new team and get back team name',(done)=>{
       
        var team = 'NewTeam';
        var expected=[{'teamname':'NewTeam'}];
        var teamid= db.InsertTeam(team).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from team name");
		//db.close();
	});

        var actual =db.getTeamNameFromID(dbTest, teamid).then ((val)=> {
		console.log (val);
		//res.send (val);
		//db.close();
	}).catch((err)=>{
		//res.send("");
		console.log ("Unable to get channels from team name");
		//db.close();
	});
//;
        assert(actual,expected);
        done();
    });
//----------------------------------------------------------------------------

 });

// //--------------------------------------------------------------------

