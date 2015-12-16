/**
 * Created by USER on 10/10/2015.
 */
/**
 * Created by USER on 7/16/2015.
 */
'use strict';
var userService = angular.module('userMainServices',['ngResource']);
userService.factory('userService',function($resource){
    return $resource('http://projectlinux.cloudapp.net/MS4SF/public/index.php/api/user/:id', { id: '@_id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    });
});
