slackApp.controller('AdministrationCtrl', function ($scope, $http) {

    $http.get('/allusers').success(function(data) {
        $scope.availableUsers = data;
    });
    
    $scope.selectUserToAdd = function() {

        $http.get('/currentTeams/:'+$scope.userToAdd.id).success(function(data) {
           $scope.availableTeams = data;
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