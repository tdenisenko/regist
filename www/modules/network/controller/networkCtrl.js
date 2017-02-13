/*
This is the controller for network page
*/
(function () {
    'use strict';

    angular
        .module('network', [])
        .controller('networkCtrl', networkCtrl);

    networkCtrl.$inject = ['$scope'];

    function networkCtrl($scope) {
        $scope.users = [
            {
                name: 'Jerome Heurtin'
            },
            {
                name: 'Ashwin Juggernaut'
            },
            {
                name: 'Demetia Greau'
            },
            {
                name: 'Tim Denisenko'
            },
            {
                name: 'Charizard Pattaralonghorn'
            },
        ];
    }
})();