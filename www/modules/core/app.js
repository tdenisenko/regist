﻿(function () {
    'use strict';

    angular.module('regist', [
        'ui.router',
        'ui.bootstrap',
        'scan'])
        .config(config)
        .run(run);


    run.$inject = ['$rootScope', '$state'];
    function run($rootScope, $state) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.currentState = $state.current.name;
        });
        //$state.go('splash', {}, { location: false });
    }

    config.$inject = ['$urlRouterProvider', '$compileProvider', '$httpProvider', '$stateProvider'];
    function config($urlRouterProvider, $compileProvider, $httpProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/scan');

        //Splash Page
        /*$stateProvider
            .state('splash', {
                url: '/splash',
                templateUrl: 'modules/splash/view/splash.html',
                controller: 'splashCtrl'
            });*/

        //Scan Page
        $stateProvider
            .state('scan', {
                url: '/scan',
                templateUrl: 'modules/scan/view/scan.html',
                controller: 'scanCtrl'
            });
           
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|ms-appx):/);

        initializeHttpProvider();

        function initializeHttpProvider() {
            //initialize get if not there
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }

            // Answer edited to include suggestions from comments
            // because previous version of code introduced browser-related errors

            //disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 01 Jul 1990 05:00:00 GMT';
            // extra
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get.Pragma = 'no-cache';

            $httpProvider.defaults.withCredentials = true;


            document.addEventListener('deviceready', onDeviceReady, false);
            function onDeviceReady() {
                console.log(device.cordova);
            }

        }
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(|local)/);

    }

})();