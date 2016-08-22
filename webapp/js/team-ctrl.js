slackApp.controller('TeamCtrl', function ($scope, $http, $routeParams, $cookieStore, $window) {
    $scope.userId = $cookieStore.get('userId');
    $http.get('/team/team').success(function (data) {
        $scope.teams = data;
        console.log(data);
    });

    // $http.get('/channel/channel' ).success(function(data) {
    //   $scope.channels = data;
    //   console.log(data);      
    // });


    $scope.IsEnter = function (event) {
        if (event.keyCode === 13) {
            //  $scope.bNew=true
            document.getElementById("txtTeam").value = "";
            $scope.teams.push({ "teamId": "", "teamName": $scope.newTeam });

            $scope.SaveTeam2DB({ "teamName": $scope.newTeam });
        }
    };




    $scope.SaveTeam2DB = function (teamData) {
        console.log(teamData);
        $http.post('/team/newTeam', teamData).success(function (data, status, headers, config) {
            //       $scope.PostDataResponse = data;
            console.log("success saving team:" + data);
        })
            .error(function (data, status, headers, config) {
                console.log("failed to save team");
            });

    };



});