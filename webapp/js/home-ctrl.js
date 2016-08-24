slackApp.controller('HomeCtrl', ['$scope', 'fileUpload', '$http', '$cookieStore', '$window',
    function ($scope, fileUpload, $http, $cookieStore, $window) {
        $scope.channels = [];
        $scope.userId = $cookieStore.get('userId');
      
        if (!$scope.userId) {
            $window.location.href = '/login.html';
        }
        else {
            
    console.log('/channel/user/' + $scope.userId);

            $http.get('/channel/user/' + $scope.userId).success(function (data) {
                $scope.channels = data;
                console.log($scope.userId);
                if ( $scope.channels.length > 0 ) {
                    $scope.getChannelMessage($scope.channels[0].id, $scope.channels[0].name);
                }
            });

            $http.get('/user/user/' + $scope.userId).success(function (data) {
                $scope.userName = data[0].userName;
            });


             $http.get ('/user/allUsers/' + $scope.userId).success(function(data){  
                $scope.allUsers=data;  

             });  

             
            $scope.privateChannels=[];
            $http.get ('/channel/privateChannel/' + $scope.userId).success(function(data){  
                 $scope.privateChannels=data;  
              
            });  
        }


        setInterval(function (){  

             $http.get('/channel/user/' + $scope.userId).success(function (data) {
                $scope.channels = data;
                console.log($scope.userId);
                if ( $scope.channels.length > 0 ) {
                    $scope.getChannelMessage($scope.channel, $scope.channelName);
                }

                 $http.get ('/channel/privateChannel/' + $scope.userId).success(function(data){  
                    $scope.privateChannels=data;  
                });
            });
         //  $scope.getChannelMessage($scope.channel, $scope.channelName);   

        }, 3000);  


        $scope.uploadFile = function () {
            var file = $scope.myFile;

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


       
        $scope.selUser="";
        $scope.getUserData=function (event) {
            if ($scope.selectedUser !== null) {
                var user = JSON.parse($scope.selectedUser);
             
                var newChannelData={"userId":$scope.userId, "userName" : $scope.userName ,"privChatUserId" : user.userId, "privChatUserName" : user.userName};

                 $http.post('/team/privateChannel', newChannelData).success(function (data, status, headers, config) {
                 })
                .error(function (data, status, headers, config) {
                     
                });

                 var tempArr=[user.userName,$scope.userName];
                 tempArr.sort;   
              

                 $http.get ('/channel/privateChannel/' + $scope.userId).success(function(data){  
                    $scope.privateChannels=data;  
                   });
                   
                
              
            }
        };

     


        $scope.getChannelMessage = function (channelId, channelName) {
           
             $scope.channel = channelId;
            $scope.channelName = channelName;
            $http.get('/message/channel/' + channelId).success(function (data) {
                $scope.messages = data;
            });
        };

        $scope.Save2DB = function (messageData) {

            $http.post('/message/message', messageData).success(function (data, status, headers, config) {
                $scope.PostDataResponse = data;
             })
                .error(function (data, status, headers, config) {
                 
                });


                

        };


        $scope.deleteChat=function ( privChannel){
            $http.get('/channal/private/remove/' + privChannel.channelId).success(function (data, status, headers, config) {
               
             })
                .error(function (data, status, headers, config) {
                 
            });

            $http.get ('/channel/privateChannel/' + $scope.userId).success(function(data){  
                    $scope.privateChannels=data;  
            });


            location.reload();  

        };

        $scope.IsEnter = function (event) {
        
            if (event.keyCode === 13) {
               

                var currentdate = new Date();
                var datetime = currentdate.getDay() + "/" + currentdate.getMonth()
                    + "/" + currentdate.getFullYear() + " "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":" + currentdate.getSeconds();

     
            
                $scope.messages.push({ "userName": $scope.userName, "date": datetime, "msg": $scope.msg });

                document.getElementById("txtMsg").value = "";


                $scope.Save2DB({ "userId": $scope.userId, "channelId": $scope.channel, "msg": $scope.msg });

            }
        };
    }]);