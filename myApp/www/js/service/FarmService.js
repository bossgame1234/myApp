/**
 * Created by USER on 7/16/2015.
 */
'use strict';
var farmService = angular.module('farmServices',['ngResource']);
farmService.factory('farmService',function($resource,$rootScope){
    return $resource('http://'+$rootScope.hostname+'/MS4SF/public/index.php/farm/:id', { id: '@_id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }});
});
