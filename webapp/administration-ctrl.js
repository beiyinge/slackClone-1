slackApp.controller('AdministrationCtrl', function ($scope, $http) {

    $scope.availableTeams = [];
    $scope.allTeams = [];

    $http.get('/allusers')
    .then(function(response) {
        $scope.availableUsers = response.data;
        return $http.get('/team/team');
    }).then(function(response) {        
            $scope.allTeams = response.data;    
    });

    
    $scope.selectUserToAdd = function(selectedUser) {

        $http.get('/currentTeams/'+selectedUser.id)
        .then(function(response) {

           $scope.currentTeams = response.data;
           var currentTeamNames = $scope.currentTeams.map(function (team) {
               return team.team;
           });

           alert(currentTeamNames);

           $scope.availableTeams = $scope.allTeams.filter(function(team, idx, arr) {
               if (currentTeamNames.indexOf(team.teamName) === -1) {
                   alert('return true - not found');
                   return true;
               }
               alert('return false - found');
               return false;
           });

           var availableTeamNames = $scope.availableTeams.map(function (team) {
               return team.teamName;
           });

           alert(availableTeamNames);

        //    for ( var ii=0; ii<$scope.allTeams.length; ii++ ) {

        //        if( $scope.currentTeams.indexOf($scope.allTeams[ii]) === -1 ) {
        //            $scope.availableTeams.push($scope.allTeams[ii]);
        //        }
        //    }
        });
    };

    $scope.selectTeamToAdd = function() {
        alert('Selected Team:'+$scope.teamToAdd.teamName);
    };

    $scope.addUserToTeam = function() {
        alert('Adding user to team...unfinished');

       //$http.get('').success(function(data) {
          //
       //});
    };
});