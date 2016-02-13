/**
 * Created by USER on 10/4/2015.
 */
'use strict';

var userMainController = angular.module('userMainController',['userMainServices']);
    userMainController.controller('registerController',['$http','$scope','$rootScope','$state','userService','ionicMaterialInk', '$ionicPopup',function($http,$scope,$rootScope,$state,userService,ionicMaterialInk,$ionicPopup){
        $scope.$parent.showHeader();
        $scope.head = "Register";
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.editMode = false;
        $scope.registerUser = {};
        ionicMaterialInk.displayEffect();
        $scope.checkRole = function() {
            $scope.farmWorker = $scope.registerUser.role == "farmWorker";
        };
        $scope.Register = function(flowFiles){
            userService.save($scope.registerUser,function(data){
                    flowFiles.opts.target = 'http://'+$rootScope.hostname+'/MS4SF/public/index.php/uploadPicture';
                    flowFiles.opts.testChunks = false;
                    flowFiles.opts.query ={id:data.id,mode:'register'};
                    flowFiles.upload();
                    $state.go("app.login");
                    alert("Success");
                },function(error)
            {
                if(error.status=="502") {
                    $ionicPopup.alert({
                        title: 'Duplicate username!',
                        template: 'Username already exist'
                    });
                }else if(error.status=="501"){
                    $ionicPopup.alert({
                        title: 'ID not found!',
                        template: 'Wrong Farm ID"'
                    });
                }else{
                    $ionicPopup.alert({
                        title: 'Error !',
                        template: 'There is a problem! Your request has not been fulfilled, please try again'
                    });
                }
            })
        };
    }]);
userMainController.controller('logoutController',['$http','$scope','$rootScope','$state','$cookieStore','$timeout',function($http,$scope,$rootScope,$state,$cookieStore,$timeout){
    $scope.logout = function() {
        delete ($rootScope.User);
        delete ($rootScope.PlotName);
        delete ($rootScope.plotId);
        delete ($rootScope.SelectedPlot);
        delete ($rootScope.DeviceId);
        delete ($rootScope.Device_id);
        delete ($rootScope.SelectedDevice);
        delete ($rootScope.Latitude);
        delete ($rootScope.Longitude);
        delete ($rootScope.UserIdentify);
        delete ($rootScope.FarmName);
        delete ($rootScope.FarmId);
        delete  ($rootScope.plantName);
        delete ($rootScope.PlantId);
        delete ($rootScope.SelectedPlant);
        delete ($rootScope.SelectedFarm);
        $scope.loginData = {};
        $scope.isExpanded = false;
        $scope.hasHeaderFabLeft = false;
        $scope.hasHeaderFabRight = false;
        $timeout(function() {
            $scope.$parent.hideHeader();
        }, 0);
        $cookieStore.remove('authToken');
        $state.go("app.login");
    }
}]);
//
//userMainController.controller('viewProfileListController',['$http','$scope','$rootScope','$location','userService',function($http,$scope,$rootScope,$location,userService){
//    $http.get("api/user?farmID="+$rootScope.farm_id).success(function(data){
//        if($rootScope.User==null){
//            $location.path("login");
//        }
//        $scope.memberList = data;
//    }).error(function(error){
//        alert("There is a problem! Your request has not been fulfilled, please try again");
//    })
//}]);
userMainController.controller('viewOwnProfileController',['$http','$scope','$rootScope','ionicMaterialInk','ionicMaterialMotion','$timeout','$state',function($http,$scope,$rootScope,ionicMaterialInk,ionicMaterialMotion,$timeout,$state){
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 400);
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 600);



    // Set Ink
    ionicMaterialInk.displayEffect();

    $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/api/user/member?id=" + $rootScope.User.id).success(function (data) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $scope.ownProfile = true;
        $scope.member = data;
        $scope.User.pictureDist = data.pictureDist ;
    });
}]);
//userMainController.controller('viewMemberProfileController',['$http','$scope','$rootScope','$location','userService','$routeParams','$route',function($http,$scope,$rootScope,$location,userService,$routeParams,$route){
//    var id = $routeParams.id ;
//    if($rootScope.User==null){
//        $location.path("login");
//    }
//    $scope.ownProfile = false;
//    $http.get("api/user/member?id=" + id).success(function (data) {
//        $scope.member = data;
//        if($scope.member.role){
//            $scope.member.role.charAt(0).big();
//        }
//    });
//}]);
//
userMainController.controller('editProfileController',['$http','$scope','$rootScope','$state','userService','ionicMaterialInk','ionicMaterialMotion','$timeout', '$ionicPopup',function($http,$scope,$rootScope,$state,userService,ionicMaterialInk,ionicMaterialMotion,$timeout, $ionicPopup){
    // Set Header
    $scope.$parent.showHeader();
    $scope.head = "Edit Profile";
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    // Set Motion

    // Set Ink
    ionicMaterialInk.displayEffect();
    $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/api/user/member?username=" + $rootScope.User.username).success(function (data) {
        $scope.registerUser = data;
    });
    $scope.editMode = true;
    if($rootScope.User==null){
        $state.go("app.login");
    }
  $scope.Edit = function(flowFiles){
      var answer = confirm("Do you want to update the profile?");
      if(answer) {
          userService.update($scope.registerUser, function (data) {
              $rootScope.User = $scope.registerUser;
              flowFiles.opts.target = 'http://'+$rootScope.hostname+'/MS4SF/public/index.php/uploadPicture';
              flowFiles.opts.testChunks = false;
              flowFiles.opts.query = {id: data.id, mode: 'register'};
              flowFiles.upload();
              $location.path("userProfile");
              alert("Success");
          }, function (error) {
              if(error.status=="502") {
                  $ionicPopup.alert({
                      title: 'Duplicate username!',
                      template: 'Username already exist'
                  });
              }else if(error.status=="501"){
                  $ionicPopup.alert({
                      title: 'ID not found!',
                      template: 'Wrong Farm ID"'
                  });
              }else{
                  $ionicPopup.alert({
                      title: 'Error !',
                      template: 'There is a problem! Your request has not been fulfilled, please try again'
                  });
              }
          });
      }
  }
}]);