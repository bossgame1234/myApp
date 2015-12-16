/**
 * Created by USER on 9/30/2015.
 */
'use strict';
var authMainController = angular.module('authMainController',['ngCookies','loginServices']);
authMainController.controller('AuthController',['$scope','$rootScope', 'loginService', '$ionicPopup', '$state','$http', '$stateParams', 'ionicMaterialInk','$timeout','$cookieStore','$auth',
    function($scope,$rootScope, loginService, $ionicPopup, $state,$http, $stateParams, ionicMaterialInk,$timeout,$cookieStore,$auth) {
        $scope.$parent.clearFabs();
        $timeout(function() {
            $scope.$parent.hideHeader();
        }, 0);
        ionicMaterialInk.displayEffect();
        $scope.auth = {
            username: "",
            password: ""
        };
        var user = Ionic.User.current();
        $scope.login = function(){
            $auth.login($scope.auth).then(function(data){
                    $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/api/user/member?username=" + $scope.auth.username+"&token="+$rootScope.token).success(function (data) {
                        $rootScope.User = data;
                        if ($rootScope.User == undefined) {
                        } else {
                            $cookieStore.put('authToken',$rootScope.User);
                            $rootScope.UserIdentify = true;
                            $state.go("app.myProfile");
                            console.log(data);
                        }
                    });
            },function(error) {
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            }
        )
        };
    }]);