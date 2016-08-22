var slackApp = angular.module('slackApp', ['ngRoute', 'ngCookies']);

slackApp.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        }).
        when('/channel.html', {
            templateUrl: 'channel.html',
            controller: 'ChannelCtrl'

        }).
        when('/administration.html', {
            templateUrl: 'administration.html',
            controller: 'AdministrationCtrl'

        }).
        when('/Teams.html', {
            templateUrl: 'Teams.html',
            controller: 'TeamCtrl'

        }).
        //        when('/login.html', {
        //          templateUrl: 'login.html',
        //          controller: 'LoginCtrl'
        //        }).
        //        when('/cart/:cart', {
        // templateUrl: 'cart.html',
        //          controller: 'CartCtrl'
        //        }).

        otherwise({
            redirectTo: '/'
        });
});

//var channels = [];








slackApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

slackApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function successCallback(response) {
            console.log("File uploaded success!");
        });
    }
}]);