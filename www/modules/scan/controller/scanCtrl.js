(function () {
    'use strict';

    angular
        .module('scan', [])
        .controller('scanCtrl', scanCtrl);

    scanCtrl.$inject = ['$scope', '$timeout', '$state', '$window', '$localStorage'];

    function scanCtrl($scope, $timeout, $state, $window, $localStorage) {
        var videoUrlWeb = 'http://img-9gag-fun.9cache.com/photo/aDj0nzd_460sv.mp4';
        var videoUrlLocal = 'file:///android_asset/www/videos/tiger.mp4';
        if ($localStorage.intro != undefined) {
            $localStorage.intro++;
        } else {
            $localStorage.intro = 0;
        }
        if ($localStorage.intro > 2) {
            $localStorage.intro = 2;
        }
        //$scope.orientation = 0;
        $scope.splash = false;
        document.addEventListener('deviceready', onDeviceReady, false);
        function onDeviceReady() {
            console.log($localStorage.intro);
            if ($localStorage.intro <= 1) {
                $window.plugins.orientationLock.lock('landscape');
                playInstructionsAndAds();
            } else {
                playAds();
            }
        }

        function playInstructionsAndAds() {
            $window.VideoPlayer.play(
                videoUrlLocal,
                {
                    volume: 0.5,
                    scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT // SCALE_TO_FIT_WITH_CROPPING
                },
                function () {
                    console.log('local video completed 1 time');
                    $window.VideoPlayer.play(
                        videoUrlLocal,
                        {
                            volume: 0.5,
                            scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT // SCALE_TO_FIT_WITH_CROPPING
                        },
                        function () {
                            console.log('local video completed 2 times');
                            playAds();
                        },
                        function (err) {
                            console.log('local video error: ' + err);
                            playAds();
                        }
                    );
                },
                function (err) {
                    console.log('local video error: ' + err);
                    playAds();
                }
            );
        }

        function playAds() {
            var options = {
                successCallback: function () {
                    console.log('web video completed');
                    $window.plugins.orientationLock.lock('portrait');
                    $window.plugins.orientationLock.unlock();
                    doRest();
                },
                errorCallback: function (errMsg) {
                    console.log('Web video error: ' + errMsg);
                    $window.plugins.orientationLock.lock('portrait');
                    $window.plugins.orientationLock.unlock();
                    doRest();
                },
                orientation: 'landscape',
                shouldAutoClose: true
            };
            $window.plugins.streamingMedia.playVideo(videoUrlWeb, options);
        }
        function doRest() {
            $timeout(function () {
                $scope.splash = true;
            });

        }
        
    }
})();