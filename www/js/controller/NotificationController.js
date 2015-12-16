/**
 * Created by USER on 11/16/2015.
 */
'use strict';

var notificationMainController = angular.module('notificationMainController',[]);
notificationMainController.controller('monitorSettingController', ['$scope', '$http','$state', '$rootScope', '$ionicPopup',
    function ($scope, $http,$state, $rootScope,$ionicPopup) {
        if($rootScope.User==null){
            $state.go('app.login');
        }
        $scope.notificationDevice ={};
        $scope.notificationDevice.minHumidityPercentage= 0;
        $scope.notificationDevice.maxHumidityPercentage =0;
        $scope.notificationDevice.minCelsius = 0;
        $scope.notificationDevice.maxCelsius = 0;
        $scope.notificationDevice.minSoilMoisture = 0;
        $scope.notificationDevice.maxSoilMoisture =0;
        $scope.notificationDevice.minLux =0;
        $scope.notificationDevice.maxLux =0;
        $scope.notificationDevice.user_id = $rootScope.User.id;
        $scope.notificationDevice.farm_id = $rootScope.FarmId
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/plot/" + $rootScope.FarmId + "/edit").success(function (data) {
            $scope.plots = data;
        });
        $scope.savePlotID = function(id) {
                    $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/device/" + id + "/edit").success(function (data) {
                        $scope.devices = data;
                    });
                    $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/plant/" + id + "/edit").success(function (data) {
                        $scope.plants = data;
            });
        };
        $scope.saveDeviceID= function(id) {
            $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/notificationMonitor/" +id).success(function (data) {
                if (data.length != 0&&data !="") {
                    $scope.hideSelect = true;
                    $scope.notificationDevice = data;
                }else{
                    $scope.notificationDevice.deviceID =id;
                }
            });
        };
        $scope.refresh  = function(){
            $scope.notificationDevice ={};
            $scope.hideSelect = false;
            $scope.notificationDevice.minHumidityPercentage= 0;
            $scope.notificationDevice.maxHumidityPercentage =0;
            $scope.notificationDevice.minCelsius = 0;
            $scope.notificationDevice.maxCelsius = 0;
            $scope.notificationDevice.minSoilMoisture = 0;
            $scope.notificationDevice.maxSoilMoisture =0;
            $scope.notificationDevice.minLux =0;
            $scope.notificationDevice.maxLux =0;
            $scope.notificationDevice.user_id = $rootScope.User.id;
            $scope.device_id =null;
        };
        $scope.updateMonitor = function(){
            $http.post("http://projectlinux.cloudapp.net/MS4SF/public/index.php/updateNotificationMonitor",$scope.notificationDevice).success(function(data){
                $ionicPopup.alert({
                    title: 'Success!',
                    template: 'Setting success'
                });
                $state.go('app.notification');
            }).error(function(error){
                $ionicPopup.alert({
                    title: 'Error!',
                    template: 'There is a problem! Your request has not been fulfilled, please try again'
                });
            })
        }

    }]);
notificationMainController.controller('NotificationSettingController', ['$scope', '$http','$state', '$rootScope', '$ionicPopup',
    function ($scope, $http,$state, $rootScope,$ionicPopup) {
        if($rootScope.User==null){
            $state.go('app.login');
        }
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/getTaskNotice?id=" + $rootScope.User.id).success(function (data) {
            if(data.length!=0) {
                $scope.noticeTask = data;
            }
        });
        $scope.changeTaskStatus = function(status){
            $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/changeTaskNotice?id=" +$rootScope.User.id+"&status="+status).success(function (data) {
                console.log(data);
            });
        };
        $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/notification?id=" + $rootScope.User.id).success(function (data) {
            if(data.length!=0) {
                $scope.noticeList = data;
            }
        });
        $scope.changeStatus = function(id,status){
            $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/changeNotice?id=" +id+"&status="+status+"&user_id="+$rootScope.User.id).success(function (data) {
                console.log(data);
            });
        };
        $scope.changeTaskNotificationStatus = function(id,status){
            $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/changeNotice?id=" +id+"&status="+status).success(function (data) {
                console.log(data);
            });
        };
        $scope.deleteNotification =function(id){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete notification',
                template: 'Are you sure to delete this notification?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/deleteNotice?id=" + id + "&status=" + status).success(function (data) {
                        $state.go('app.notification', null, {reload: true});
                    });
                }
            });
        }
    }]);
notificationMainController.controller('editNotificationController', ['$scope', '$http','$state', '$rootScope', '$ionicPopup','$stateParams',
    function ($scope, $http,$state, $rootScope,$ionicPopup,$stateParams) {
        $scope.hideSelect = true;
        $scope.editMode= true;
        if($rootScope.User==null){
            $state.go('app.login');
        }
            $http.get("http://projectlinux.cloudapp.net/MS4SF/public/index.php/notificationMonitor/" +$stateParams.id).success(function (data) {
                if (data.length != 0&&data !="") {
                    $scope.notificationDevice = data;
                }else{
                    $scope.notificationDevice.deviceID =id;
                }
            });
        $scope.updateMonitor = function(){
            $http.post("http://projectlinux.cloudapp.net/MS4SF/public/index.php/updateNotificationMonitor",$scope.notificationDevice).success(function(data){
                $ionicPopup.alert({
                    title: 'Success!',
                    template: 'Setting success'
                });
                $state.go('app.notification');
            }).error(function(error){
                $ionicPopup.alert({
                    title: 'Error!',
                    template: 'There is a problem! Your request has not been fulfilled, please try again'
                });
            })
        }
    }]);


