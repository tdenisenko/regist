/*
This is the controller for event registration page
*/
(function () {
    'use strict';

    angular
        .module('eventregistration', [])
        .controller('eventregistrationCtrl', eventregistrationCtrl);

    eventregistrationCtrl.$inject = ['$scope', '$localStorage', '$http', '$loading', '$uibModal'];

    function eventregistrationCtrl($scope, $localStorage, $http, $loading, $uibModal) {

    }
});