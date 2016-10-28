(function () {
    'use strict';

    angular
        .module('homepage', [])
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = ['$scope', '$state', '$stateParams'];

    function homepageCtrl($scope, $state, $stateParams) {
        if ($stateParams.splash === true) {
            $scope.splash = $stateParams.splash;
            $state.go('scan', {}, { location: false });
        } else if ($stateParams.vuforiaCallback === true) {

        } else {
            $scope.splash = false;
            $state.go('login', {}, { location: false });
        }
        

    }
})();