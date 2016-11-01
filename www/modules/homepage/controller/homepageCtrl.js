/*
This is the controller for home page.
*/
(function () {
    'use strict';

    angular
        .module('homepage', [])
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = ['$scope', '$state', '$stateParams'];

    function homepageCtrl($scope, $state, $stateParams) {
        //If called after a successful login, go to AR scan
        if ($stateParams.splash === true) {
            $scope.splash = $stateParams.splash;
            $state.go('scan', {}, { location: false });
        }
        //if called after successful AR scan, go to ...
        else if ($stateParams.vuforiaCallback === true) {

        }
        //If called when app first opens, go to login page
        else {
            $scope.splash = false;
            $state.go('login', {}, { location: false });
        }
        

    }
})();