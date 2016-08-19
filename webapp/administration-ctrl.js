slackApp.controller('AdministrationCtrl', function ($scope, $http) {

    $http.get('/allusers').success(function(data) {
        $scope.availableUsers = data;
    });
    
    $scope.selectUserToAdd = function() {
        alert('Selected User:'+$scope.userToAdd);

        $http.get('/team/team/').success(function(data) {
           $scope.availableTeams = data;
        });
    };

    $scope.selectTeamToAdd = function() {
        alert('Selected Team:'+$scope.teamToAdd.teamName);
    };


    $scope.addUserToTeam = function() {
        alert('Selected Name:'+$scope.userToAdd);

       //$http.get('/team/team/').success(function(data) {
          //$scope.availableTeams = data;
       //});
    };
});