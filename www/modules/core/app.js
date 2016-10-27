(function () {
    'use strict';

    angular.module('regist', [
        'ui.router',
        'ui.bootstrap',
        'ngStorage',
        'darthwade.dwLoading',
        'ngAnimate',
        'homepage',
        'login'])
        .config(config)
        .run(run);


    run.$inject = ['$rootScope', '$state'];
    function run($rootScope, $state) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.currentState = $state.current.name;
            console.log($rootScope.currentState);
        });
        //$state.go('splash', {}, { location: false });
    }

    config.$inject = ['$urlRouterProvider', '$compileProvider', '$httpProvider', '$stateProvider'];
    function config($urlRouterProvider, $compileProvider, $httpProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/homepage');

        //Splash Page
        /*$stateProvider
            .state('splash', {
                url: '/splash',
                templateUrl: 'modules/splash/view/splash.html',
                controller: 'splashCtrl'
            });*/

        //Home Page
        $stateProvider
            .state('homepage', {
                url: '/homepage',
                templateUrl: 'modules/homepage/view/homepage.html',
                controller: 'homepageCtrl',
                params: {
                    splash: false
                }
            });

        //Login Page
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/login/view/login.html',
                controller: 'loginCtrl'
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
                //console.log(device.cordova);
                console.log(new Date().toLocaleTimeString());
            }

        }
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(|local)/);

    }

})();
