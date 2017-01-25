/*
This is the controller for home page.
*/
(function () {
    'use strict';

    angular
        .module('homepage', [])
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$cordovaFileTransfer'];

    function homepageCtrl($rootScope, $scope, $state, $stateParams, $timeout, $cordovaFileTransfer) {
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

        //Check if the app is running on browser or device
        if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        //Download markers when device is ready
        function onDeviceReady() {
            console.log('Downloading...');
            var url = encodeURI('http://regis.ladargroup.com/datasets/regis.xml');
            var targetPath = cordova.file.externalApplicationStorageDirectory + '/dataset.xml';
            var trustHosts = true;
            var options = {};

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
              .then(function (result) {
                  console.log("download complete: " + result.toURL());
                  $rootScope.datasetxml = result.toURL();
              }, function (error) {
                  console.log('Download failed:');
                  console.log("download error source " + error.source);
                  console.log("download error target " + error.target);
                  console.log("download error code" + error.code);
              }, function (progress) {
                  $timeout(function () {
                      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                  });
              });

            url = encodeURI('http://regis.ladargroup.com/datasets/regis.dat');
            targetPath = cordova.file.externalApplicationStorageDirectory + '/dataset.dat';

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
              .then(function (result) {
                  console.log("download complete: " + result.toURL());
                  $rootScope.datasetdat = result.toURL();
              }, function (error) {
                  console.log('Download failed:');
                  console.log("download error source " + error.source);
                  console.log("download error target " + error.target);
                  console.log("download error code" + error.code);
              }, function (progress) {
                  $timeout(function () {
                      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                  });
              });
        }
    }
})();