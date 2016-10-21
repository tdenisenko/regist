(function () {
    'use strict';

    angular
        .module('scan', [])
        .controller('scanCtrl', scanCtrl);

    scanCtrl.$inject = ['$scope', '$timeout', '$state'];

    function scanCtrl($scope, $timeout, $state) {
        $scope.splash = false;
        $timeout(function () {
            $scope.splash = true;
        }, 1000);
    }
})();