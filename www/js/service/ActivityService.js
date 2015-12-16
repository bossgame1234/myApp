/**
 * Created by USER on 10/16/2015.
 */
'use strict';
var activityService = angular.module('activityServices',['ngResource']);
activityService.factory('activityService',function($resource){
    return $resource('http://projectlinux.cloudapp.net/MS4SF/public/index.php/activity/:id', { id: '@_id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }});
});