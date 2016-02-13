/**
 * Created by Boss on 7/15/2015.
 */
'use strict';
var taskMainController = angular.module('taskMainController',['taskServices']);
taskMainController.controller('addTaskController',['$scope', '$http','$state', '$rootScope','taskService','$filter',
    function ($scope, $http,$state, $rootScope,taskService,$filter) {
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $scope.editTask = false;
        $scope.task = {
            username : $rootScope.User.username
        };
        $scope.task.type = new Array();
        $scope.task.worker = new Array();
        $scope.plot_id = 0;
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plot/" + $rootScope.FarmId+"/edit").success(function (data) {
            $scope.plots = data;
            $scope.loadPlot = true;
        });
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/allMember?id=" + $rootScope.FarmId).success(function (data) {
            $scope.members = data;
            if( $scope.members!=undefined) {
            for(var i=0;i<$scope.members.length;i++)
            {
                if($scope.members[i].username==$rootScope.User.username){
                    $scope.members.splice(i,1);
                }
            }
                $scope.loadMember = true;
            }
        });
        $scope.savePlotID = function(id) {
            $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plant/" + id + "/edit").success(function (data) {
                $scope.plants = data;
                $scope.loadPlant = true;
            });
        };
        $scope.task.date =  new Date("MM/dd/yyyy");
        $scope.task.time =  new Date("HH:mm:ss");
        $scope.tillingCheck = function(){
            if(!$rootScope.tillingSelected) {
                $scope.task.type[0] = 1;
                $rootScope.tillingSelected = true;
            }else{
                $scope.task.type[0] = 0;
                $rootScope.tillingSelected = false;
            }
        };
        $scope.plantingCheck = function(){
            if(!$rootScope.plantingSelected) {
                $scope.task.type[1] = 2;
                $rootScope.plantingSelected = true;
            }else{
                $scope.task.type[1] = 0;
                $rootScope.plantingSelected = false;
            }
        };
        $scope.pruningCheck = function(){
            if(!$rootScope.pruningSelected) {
                $scope.task.type[2] = 3;
                $rootScope.pruningSelected = true;
            }else{
                $scope.task.type[2] = 0;
                $rootScope.pruningSelected= false;
            }
        };
        $scope.harvestingCheck = function(){
            if(!$rootScope.harvestingSelected) {
                $scope.task.type[3] = 4;
                $rootScope.harvestingSelected = true;
            }else{
                $scope.task.type[3] = 0;
                $rootScope.harvestingSelected = false;
            }
        };
        $scope.fertilizingCheck = function(){
            if(!$rootScope.fertilizingSelected) {
                $scope.task.type[4] = 5;
                $rootScope.fertilizingSelected = true;
            }else{
                $scope.task.type[4] = 0;
                $rootScope.fertilizingSelected = false;
            }
        };

        $scope.wateringCheck = function(){
            if(!$rootScope.wateringSelected) {
                $scope.task.type[5] = 6;
                $rootScope.wateringSelected = true;
            }else{
                $scope.task.type[5] = 0;
                $rootScope.wateringSelected = false;
            }
        };
        $scope.scoutingCheck = function(){
            if(!$rootScope.scoutingSelected) {
                $scope.task.type[6] = 7;
                $rootScope.scoutingSelected = true;
            }else{
                $scope.task.type[6] = 0;
                $rootScope.scoutingSelected = false;
            }
        };
        var $i=0;
        $scope.name = new Array();
        $scope.addMember=function(member){
            var found =false;
            var a = member.split(".");
            if(a!=undefined) {
                var memberID = a[0];
                for(var j=0;j< $scope.task.worker.length;j++){
                    if($scope.task.worker[j] == memberID){
                        found =true;
                    }
                }
                if(!found) {
                    $scope.name[$i] = a[1];
                    $scope.task.worker[$i] = memberID;
                    $i++;
                }
            }
        };
        $scope.removeMember=function(memberID){
            for(var j=0;j< $scope.task.worker.length;j++){
                if($scope.task.worker[j] == memberID){
                    $scope.task.worker.splice(j,1);
                    $scope.name.splice(j,1);
                    $i--;
                }
            }
        };
        $scope.addTask = function(flowFiles){
            taskService.save($scope.task,function(data){
                flowFiles.opts.target = 'http://'+$rootScope.hostname+'/MS4SF/public/index.php/uploadPicture';
                flowFiles.opts.testChunks = false;
                flowFiles.opts.query ={id:data.id,mode:'task'};
                flowFiles.upload();
                alert("Success");
                $state.go("app.assign");
                $scope.$digest();
            },function(error){
                if(error.status=="500"){
                    alert("There is a problem! Your request has not been fulfilled, please try again \n ERROR : Please input all information");
                }
            });
        }
    }]);
taskMainController.controller('editTaskController', ['$scope', '$http', '$state', '$rootScope','taskService','$filter','$stateParams',
    function ($scope, $http, $state, $rootScope,taskService,$filter,$stateParams) {
        $scope.editTask = true;
        var $i = 0;
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plot/" + $rootScope.FarmId+"/edit").success(function (data) {
            $scope.plots = data;
            $scope.loadPlot = true;
        });
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/allMember?id=" + $rootScope.FarmId).success(function (data) {

            $scope.members = data;
            if( $scope.members!=undefined) {
                for(var i=0;i<$scope.members.length;i++)
                {
                    if($scope.members[i].username==$rootScope.User.username){
                        $scope.members.splice(i,1);
                    }
                }
                $scope.loadMember = true;
            }
        });
        $scope.savePlotID = function(id) {
            $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/plant/" + id + "/edit").success(function (data) {
                $scope.plants = data;
                $scope.loadPlant = true;
            });
        };
        $http.get('http://'+$rootScope.hostname+'/MS4SF/public/index.php/task/'+$stateParams.id).success(function(data){
            $scope.task= data;
            $scope.task.worker = new Array();
            $scope.name = new Array();
            //   $scope.task.date =  $filter('date')(data.date,"MM/dd/yyyy");
            $scope.task.type = new Array();
            $scope.plot_id = data.plant.plot.id;
            if( $scope.task!=undefined) {
                $i = data.worker_member.length;
                for (var j = 0; j < data.worker_member.length; j++) {
                    $scope.name[j] = data.worker_member[j].name;
                    $scope.task.worker[j] = data.worker_member[j].id;
                }
                for (var i = 0; i < data.activity_type.length; i++) {
                    switch (data.activity_type[i].id) {
                        case 1:
                            $scope.task.type[0] = 1;
                            $rootScope.tillingSelected = true;
                            break;
                        case 2:
                            $scope.task.type[1] = 2;
                            $rootScope.plantingSelected = true;
                            break;
                        case 3:
                            $scope.task.type[2] = 3;
                            $rootScope.pruningSelected = true;
                            break;
                        case 4:
                            $scope.task.type[3] = 4;
                            $rootScope.harvestingSelected = true;
                            break;
                        case 5:
                            $scope.task.type[4] = 5;
                            $rootScope.fertilizingSelected = true;
                            break;
                        case 6:
                            $scope.task.type[5] = 6;
                            $rootScope.wateringSelected = true;
                            break;
                        case 7:
                            $scope.task.type[6] = 7;
                            $rootScope.scoutingSelected = true;
                            break;
                    }
                }
            }
        }).error(function(error){
            if(error.status=="500"){
                alert("There is a problem! Your request has not been fulfilled, please try again \n ERROR : Please input all information");
            }
        });
        $scope.editTask = function(flowFiles){
            var answer = confirm("Do you want to update task?");
            if(answer) {
                taskService.update({id: $scope.task.id}, $scope.task, function (data) {
                    flowFiles.opts.target = 'http://'+$rootScope.hostname+'/MS4SF/public/index.php/uploadPicture';
                    flowFiles.opts.testChunks = false;
                    flowFiles.opts.query = {id: data.id, mode: 'task'};
                    flowFiles.upload();
                    if($rootScope.User.role=="farm worker"){
                        $state.go("app.work");
                    }else {
                        $state.go("app.assign");
                    }
                    alert("success");
                },function(error){
                    if(error.status=="500"){
                        alert("There is a problem! Your request has not been fulfilled, please try again \n ERROR : Please input all information");
                    }
                })
            }
        };
        $scope.tillingCheck = function(){
            if(!$rootScope.tillingSelected) {
                $scope.task.type[0] = 1;
                $rootScope.tillingSelected = true;
            }else{
                $scope.task.type[0] = 0;
                $rootScope.tillingSelected = false;
            }
        };
        $scope.plantingCheck = function(){
            if(!$rootScope.plantingSelected) {
                $scope.task.type[1] = 2;
                $rootScope.plantingSelected = true;
            }else{
                $scope.task.type[1] = 0;
                $rootScope.plantingSelected = false;
            }
        };
        $scope.pruningCheck = function(){
            if(!$rootScope.pruningSelected) {
                $scope.task.type[2] = 3;
                $rootScope.pruningSelected = true;
            }else{
                $scope.task.type[2] = 0;
                $rootScope.pruningSelected= false;
            }
        };
        $scope.harvestingCheck = function(){
            if(!$rootScope.harvestingSelected) {
                $scope.task.type[3] = 4;
                $rootScope.harvestingSelected = true;
            }else{
                $scope.task.type[3] = 0;
                $rootScope.harvestingSelected = false;
            }
        };
        $scope.fertilizingCheck = function(){
            if(!$rootScope.fertilizingSelected) {
                $scope.task.type[4] = 5;
                $rootScope.fertilizingSelected = true;
            }else{
                $scope.task.type[4] = 0;
                $rootScope.fertilizingSelected = false;
            }
        };

        $scope.wateringCheck = function(){
            if(!$rootScope.wateringSelected) {
                $scope.task.type[5] = 6;
                $rootScope.wateringSelected = true;
            }else{
                $scope.task.type[5] = 0;
                $rootScope.wateringSelected = false;
            }
        };
        $scope.scoutingCheck = function(){
            if(!$rootScope.scoutingSelected) {
                $scope.task.type[6] = 7;
                $rootScope.scoutingSelected = true;
            }else{
                $scope.task.type[6] = 0;
                $rootScope.scoutingSelected = false;
            }
        };
        $scope.addMember=function(member){
            var found =false;
            var a = member.split(".");
            if(a!=undefined) {
                var memberID = a[0];
                for(var j=0;j< $scope.task.worker.length;j++){
                    if($scope.task.worker[j] == memberID){
                        found =true;
                    }
                }
                if(!found) {
                    $scope.name[$i] = a[1];
                    $scope.task.worker[$i] = memberID;
                    $i++;
                }
            }
        };
        $scope.removeMember=function(memberID){
            for(var j=0;j< $scope.task.worker.length;j++){
                if($scope.task.worker[j] == memberID){
                    $scope.task.worker.splice(j,1);
                    $scope.name.splice(j,1);
                    $i--;
                }
            }
        };
    }]);
taskMainController.controller('timeLineTaskController', ['$scope','$rootScope', '$http','$filter','taskService','$state','ionicMaterialInk','ionicMaterialMotion', '$timeout',
    function ($scope,$rootScope ,$http,$filter,taskService,$state,ionicMaterialInk,ionicMaterialMotion,$timeout) {
        $scope.toDay =  $filter('date')(new Date(),"yyyy-MM-dd");
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        // Activate ink for controller
        ionicMaterialInk.displayEffect();
        // Activate ink for controller
        $scope.check =false;
        if($rootScope.User==null){
            $state.go("app.login");
        }
        Date.prototype.withoutTime = function () {
            var d = new Date(this);
            d.setHours(0, 0, 0, 0);
            return d
        };
        $scope.set = new Array();
        $scope.icon = new Array();
        $scope.toDay =  $filter('date')(new Date(),"yyyy-MM-dd");
        $http.get('http://'+$rootScope.hostname+'/MS4SF/public/index.php/taskList?id='+$rootScope.User.id).success(function(data){
            $scope.taskList = data;
            for(var i=0;i<data.length;i++) {
                $scope.check = true;
                if ($scope.taskList[i].pictureLocation != '') {
                    var showImage = '<img class="img-responsive" src="http://projectlinux.cloudapp.net/MS4SF/public/' + $scope.taskList[i].pictureLocation + '">';
                }
                var colorBadge = '';
                var badgeIcon = '';
                if ($scope.taskList[i].status == "Working") {
                    $scope.taskList[i].color = {'border':' 3px solid #ffcc33'};
                } else if ($scope.taskList[i].status == "Late") {
                    $scope.taskList[i].color = {'border':' 3px solid #f00'};
                } else if ($scope.taskList[i].status == "Done") {
                    $scope.taskList[i].color = {'border':' 3px solid #00cc33'};
                } else if ($scope.taskList[i].status == "Late done") {
                    $scope.taskList[i].color = {'border':' 3px solid #f00'};
                } else {
                    $scope.taskList[i].color = {};
                }
            }
                $scope.acceptTask = function (id, status) {
                    $http.post("http://"+$rootScope.hostname+"/MS4SF/public/index.php/status", {id: id, status: status}).success(function (data) {
                        alert("Success");
                        $state.go('app.work',{},{reload:true});
                    }).error(function (error) {
                        alert("There is a problem! Your request has not been fulfilled, please try again");
                    })
                };
                $scope.finishTask = function (id, status) {
                    $http.post("http://"+$rootScope.hostname+"/MS4SF/public/index.php/status", {id: id, status: status}).success(function (data) {
                        alert("Success");
                        $state.go('app.work',{},{reload:true});
                    }).error(function (error) {
                        alert("There is a problem! Your request has not been fulfilled, please try again");
                    })
                };
                // optional: not mandatory (uses angular-scroll-animate)
                $scope.animateElementIn = function ($el) {
                    $el.removeClass('hidden');
                    $el.addClass('bounce-in');
                };
                // optional: not mandatory (uses angular-scroll-animate)
                $scope.animateElementOut = function ($el) {
                    $el.addClass('hidden');
                    $el.removeClass('bounce-in');
                };
            $scope.remotion = function(){
                $timeout(function() {
                    ionicMaterialMotion.fadeSlideIn({
                        selector: '.animate-fade-slide-in .item'
                    });
                }, 400);
            };
            $timeout(function() {
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 400);
            }).error(
            function(error){
                if(error.status=="500"){
                    alert("There is a problem! Your request has not been fulfilled, please try again");
                }
            }
        );
    }]);
taskMainController.controller('overAllTaskController',['$scope', '$interval','$http','$state', '$rootScope','taskService',
    function ($scope,$interval, $http,$state, $rootScope,taskService) {
       var remaining =0;
       var working=0;
       var done =0;
       var lateDone =0;
       var late=0;
        if($rootScope.User==null){
            $state.go("app.login");
        }
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/allMember?id=" + $rootScope.FarmId).success(function (data) {
            $scope.members = data;
            if( $scope.members!=undefined) {
                for(var i=0;i<$scope.members.length;i++)
                {
                    if($scope.members[i].username==$rootScope.User.username){
                        $scope.members.splice(i,1);
                    }
                }
                $scope.loadMember = true;
            }
        });
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/top3?id=" + $rootScope.FarmId).success(function (data) {
            $scope.tops = data;
        });
        var id=   $rootScope.FarmId;
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/task?id="+id).success(function(data){
        $scope.tasks = data;
        for(var i=0;i<$scope.tasks.length;i++){
            if($scope.tasks[i].status=="Remaining"){
                remaining++;
            }else if($scope.tasks[i].status=="Done"){
                done++;
            }else if($scope.tasks[i].status=="Late done"){
                lateDone++;
            }else if($scope.tasks[i].status=="Late"){
                late++;
            }else if($scope.tasks[i].status=="Working"){
                working++;
            }
        }
            $scope.chartObject = {
                "type": "PieChart",
                "displayed": false,
                "data": {
                    "cols": [
                        {
                            "id": "status",
                            "label": "Status",
                            "type": "string",
                            "p": {}
                        },
                        {
                            "id": "count",
                            "label": "count",
                            "type": "number",
                            "p": {}
                        }
                    ],
                    "rows": [
                        {
                            "c": [
                                {
                                    "v": "remaining"
                                },
                                {
                                    "v": remaining
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": "working"
                                },
                                {
                                    "v": working
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": "done"
                                },
                                {
                                    "v": done
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": "late done"
                                },
                                {
                                    "v": lateDone
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": "late"
                                },
                                {
                                    "v": late
                                }
                            ]
                        }
                    ]
                },
                "options": {
                    "title": "",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                        "title": "Count",
                        "gridlines": {
                            "count": 10
                        }
                    },
                    "hAxis": {
                        "title": "Status"
                    }
                },
                "formatters": {}
            }
        }).error(function(error){
            if(error.status=="500"){
                alert("There is a problem! Your request has not been fulfilled, please try again");
            }
        });
    }
    ]);
taskMainController.controller('overAllTaskListController', ['$scope','$rootScope', '$http','$filter','taskService','$state','ionicMaterialInk','ionicMaterialMotion', '$timeout',
    function ($scope,$rootScope ,$http,$filter,taskService,$state,ionicMaterialInk,ionicMaterialMotion,$timeout) {
        var id=   $rootScope.FarmId;
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        $http.get("http://"+$rootScope.hostname+"/MS4SF/public/index.php/task?id="+id).success(function(data) {
            $scope.tasks = data;
        });
        $scope.deleteTask= function(TaskID){
            var answer = confirm("Do you want to delete task?");
            if(answer) {
                taskService.delete({id: TaskID}, function (data) {
                    alert("Success");
                    $state.go("app.assign")
                }, function (error) {
                    if(error.status=="500"){
                        alert("There is a problem! Your request has not been fulfilled, please try again");
                    }
                })
            }
        };
    }]);