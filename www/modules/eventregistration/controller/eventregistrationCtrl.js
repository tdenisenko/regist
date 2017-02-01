/*
This is the controller for event registration page
*/
(function () {
    'use strict';

    angular
        .module('eventregistration', [])
        .controller('eventregistrationCtrl', eventregistrationCtrl);

    eventregistrationCtrl.$inject = ['$rootScope', '$scope', '$http', '$loading'];

    function eventregistrationCtrl($rootScope, $scope, $http, $loading) {
        $scope.event = {};
        $scope.user = {};
        var eventDetailsUrl = 'http://regis.ladargroup.com/api/event/template';
        var requestObj = {
            event_id: $rootScope.eventId,
            user_id: $rootScope.userId
        };
        $http.post(eventDetailsUrl, requestObj).then(function (eventInfo) {
            var event = eventInfo.data.event;
            event.fields = _.mapValues(eventInfo.data.event.fields, function (field) {
                var f = field;
                f.field_name = field.label.toLowerCase().replace(" ", "");
                return f;
            });
            $scope.event = event;
            $scope.user = eventInfo.data.user;
        });
        var saveEventInfoUrl = 'http://regis.ladargroup.com/api/event/info';
        $scope.registerEvent = function () {
            var eventObj = {
                event_id: $scope.event.id,
                user_id: $scope.user.id
            };
            for (var i = 0; i < $scope.event.fields.length; i++) {
                eventObj[$scope.event.fields[i].field] = $scope.user[$scope.event.fields[i].field_name];
            }
            $loading.start('eventregistration');
            $http.post(saveEventInfoUrl, eventObj).then(function (response) {
                $loading.finish('eventregistration');
                if (response.data.status === 'OK') {
                    console.log('event registration successful');
                    $state.go('homepage', { eventRegistrationCallback: true });
                }
            });
        };
    }
})();