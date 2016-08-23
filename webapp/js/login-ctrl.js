slackApp.controller('LoginCtrl', function ($scope, $http, $cookieStore, $window) {
  		$cookieStore.remove('userId');
  		$cookieStore.remove('userName');
var nc=5;
	$scope.submit = function () {
        if ($scope.username && $scope.password) {
			console.log($scope.username + " " + $scope.password);
			$http.get('/user/login?username=' + $scope.username + '&password=' + $scope.password).success(function (data) {
				if (data.length >= 1) {
					$scope.userId = data[0].userId;
					console.log($scope.userId);
					$cookieStore.put('userId', $scope.userId);
					$cookieStore.put('userName', $scope.username);
					$window.location.href = '/slack.html';
				}
				else {
					nc--;
					if(nc<1) {$window.location.href = '/signup.html';}
					$scope.loginErr = "Wrong Username or Password! Remaining Counts : "+nc;
					console.log($scope.loginErr);
				}
            });
        }
	};
});