slackApp.controller('SignUpCtrl', function ($scope, $http, $cookieStore, $window) {
  		$cookieStore.remove('userId');

		  $scope.submit = function () {

        if (!$scope.username || $scope.username.length < 3) {
            $scope.signUpErr = "Username is required (at least 3 characters)!";
            return;
        }
        else if (!$scope.password || $scope.re_password.length < 3) {
            $scope.signUpErr = "Password is required (at least 3 characters)!";
            return;
        }
        else if ($scope.password != $scope.re_password) {
            $scope.signUpErr = "Password doesn't match!";
            return;
        }
        else if (!$scope.email) {
            $scope.signUpErr = "Email is required!";
            return;
        }

        $scope.signUpErr = "";

        $http.get('/user/checkuser?username=' + $scope.username).success(function (data) {
            console.log(data);
            if (Object.keys(data).length != 0) {
                $scope.signUpErr = "Error: username already existed!";
            }
            else {
                $http({
                    method: 'POST',
                    url: '/user/signup',
                    data: { 'username': $scope.username, 'password': $scope.password, 'email': $scope.email }
                    //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response) {
                    $scope.signUpErr = "";
                    $scope.signUpSucceed = "Sign up successed!";
                    $cookieStore.put(response.data[0]);
                    $cookieStore.put('userId', response.data[0].userId);
                    $cookieStore.put('userName', $scope.username);
                    //$window.location.href = '/login.html';
                }, function errorCallback(response) {
                    $scope.signUpErr = "Error: username already existed!";
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        });
        // .failed(function(data) {
        //   console.log("failed");

        //   }
        // });
    }
});