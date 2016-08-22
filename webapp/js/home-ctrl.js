slackApp.controller('HomeCtrl', ['$scope', 'fileUpload', '$http', '$cookieStore', '$window',
    function ($scope, fileUpload, $http, $cookieStore, $window) {
        //$scope.channels = [];
        $scope.userId = $cookieStore.get('userId');
        console.log($scope.userId);
        if (!$scope.userId) {
            $window.location.href = '/login.html';
        }
        else {
            $http.get('/channel/user/' + $scope.userId).success(function (data) {
                $scope.channels = data;
                $scope.getChannelMessage($scope.channels[0].id, $scope.channels[0].name);
            });

            $http.get('/user/user/' + $scope.userId).success(function (data) {
                //    console.log ("got user name");
                $scope.userName = data[0].userName;
                console.log("name--" + $scope.userName);
            });


             $http.get ('/user/allUsers/' + $scope.userId).success(function(data){  
                $scope.allUsers=data;  
                 console.log (data);  
              });  
             
            $http.get ('/channel/privateChannel/' + $scope.userId).success(function(data){  
                 $scope.privateChannels=data;  
                  console.log ("Private channels :" + data[0].channelId + " - " + data[0].channelName);  
                 
            });  


        }


        setInterval(function (){  
           $scope.getChannelMessage($scope.channel, $scope.channelName);   
          console.log ("message refresh");     
        }, 3000);  


        $scope.uploadFile = function () {
            var file = $scope.myFile;

            console.log('file is ');
            console.dir(file);

            var uploadUrl = "/channel/uploadFile";
            fileUpload.uploadFileToUrl(file, uploadUrl, function(response) {
                //messageData = {"userId": $scope.userId, "channelId": $scope.channel, "msg": "[file]"+file.name+"[/file]"} ;
                messageData = {"userId": $scope.userId, "channelId": $scope.channel, 
                "msg": "<a href=/uploads/" + file.name + ">"+file.name+"</a>"} ;
                console.log(messageData);
                $http.post('/message/message', messageData)
                    .success(function (data, status, headers, config) {
                        $scope.PostDataResponse = data;
                        $scope.getChannelMessage($scope.channel, $scope.channelName);
                        console.log("success:" + data);
                    })
                    .error(function (data, status, headers, config) {
                        console.log("failed to save");
                    });
               });
        };

        $scope.getChannelMessage = function (channelId, channelName) {
            console.log(channelName);
            $scope.channel = channelId;
            $scope.channelName = channelName;
            $http.get('/message/channel/' + channelId).success(function (data) {
                $scope.messages = data;
                console.log($scope.messages);
            });



        };

        $scope.Save2DB = function (messageData) {

            $http.post('/message/message', messageData).success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
                console.log("success:" + data);
            })
                .error(function (data, status, headers, config) {
                    console.log("failed to save");
                });

        };

        $scope.IsEnter = function (event) {
            // console.log (" a keypress");

            if (event.keyCode === 13) {

                var currentdate = new Date();
                var datetime = currentdate.getDay() + "/" + currentdate.getMonth()
                    + "/" + currentdate.getFullYear() + " "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                console.log($scope.msg);

                $scope.messages.push({ "userName": $scope.userName, "date": datetime, "msg": $scope.msg });

                document.getElementById("txtMsg").value = "";


                $scope.Save2DB({ "userId": $scope.userId, "channelId": $scope.channel, "msg": $scope.msg });

            }
        };
    }]);