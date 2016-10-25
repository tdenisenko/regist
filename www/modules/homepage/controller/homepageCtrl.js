(function () {
    'use strict';

    angular
        .module('homepage', [])
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = ['$scope', '$state', '$stateParams'];

    function homepageCtrl($scope, $state, $stateParams) {
        if ($stateParams.splash === true) {
            $scope.splash = $stateParams.splash;
        } else {
            $scope.splash = false;
            $state.go('login', {}, { location: false });
        }
        

    }
})();