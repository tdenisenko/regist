/*
This is the controller for login page
*/
(function () {
    'use strict';

    angular
        .module('login', [])
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$timeout', '$state', '$window', '$localStorage', '$http', '$loading', '$uibModal'];

    function loginCtrl($scope, $timeout, $state, $window, $localStorage, $http, $loading, $uibModal) {
        //Variable declarations
        $scope.loginRegister = 'Login';
        $scope.loginData = {
            username: $localStorage.username == undefined ? '' : $localStorage.username,
            password: $localStorage.password == undefined ? '' : $localStorage.password,
            checkLogin: $localStorage.checkLogin == undefined ? false : $localStorage.checkLogin
        };
        $scope.registrationData = {
            firstname: '',
            lastname: '',
            birthdateObj: undefined,
            birthdate: '',
            username: '',
            password: '',
            mobileNumbers: {
                personal: '',
                primary: '',
                others: []
            },
            emails: {
                primary: '',
                personal: '',
                organization: '',
                others: []
            }
        };
        /*$scope.datepicker = {
            date: '',
            dateOptions: {
                datepickerMode: 'year'
            },
            popup: {
                opened: false
            },
            openDatePicker: function () {
                $scope.datepicker.popup.opened = true;
            }
        }*/

        $scope.checkEmail = [true, false, false, false, false];
        $scope.checkMobile = [true, false, false, false, false];

        //Change between login and register page
        $scope.switchLoginRegister = function () {
            switch ($scope.loginRegister) {
                case 'Register':
                    $scope.loginRegister = 'Login';
                    $scope.loginData.username = $scope.registrationData.username;
                    break;
                case 'Login':
                    $scope.loginRegister = 'Register';
                    break;
            }
            $scope.$apply;
        }

        $scope.splash = false;

        //Set primary email for registration
        $scope.setPrimaryEmail = function (email, index) {
            if (!$scope.checkEmail[index]) {
                $scope.checkEmail[index] = true;
            } else {
                $scope.registrationData.emails.primary = email;
                _.fill($scope.checkEmail, false, 0, index);
                _.fill($scope.checkEmail, false, index + 1);
            }
        }
        //Set primary mobile number for registration
        $scope.setPrimaryMobile = function (mobile, index) {
            if (!$scope.checkMobile[index]) {
                $scope.checkMobile[index] = true;
            } else {
                $scope.registrationData.mobileNumbers.primary = mobile;
                _.fill($scope.checkMobile, false, 0, index);
                _.fill($scope.checkMobile, false, index + 1);
            }
        }

        //Add extra email field in registration
        $scope.addEmailField = function () {
            if ($scope.registrationData.emails.others.length < 3) {
                $scope.registrationData.emails.others.push('');
            }
        }

        //Add extra mobile number field in registration
        $scope.addMobileField = function () {
            if ($scope.registrationData.mobileNumbers.others.length < 4) {
                $scope.registrationData.mobileNumbers.others.push('');
            }
        }

        //Local variables
        var videoUrlWeb = 'http://img-9gag-fun.9cache.com/photo/aDj0nzd_460sv.mp4';
        var videoUrlLocal = 'file:///android_asset/www/videos/tiger.mp4';
        var loginUrl = 'http://regis.ladargroup.com/api/user/login';
        var registrationUrl = 'http://regis.ladargroup.com/api/user/app-register';

        //If intro video is watched more than 2 times, skip the video
        if ($localStorage.intro != undefined) {
            $localStorage.intro++;
        } else {
            $localStorage.intro = 0;
        }
        if ($localStorage.intro > 2) {
            $localStorage.intro = 2;
        }

        //Check if the app is running on browser or device
        var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        if (app) {
            console.log('Application running on device');
            document.addEventListener('deviceready', onDeviceReady, false);
        } else {
            console.log('Application running on browser');
            showLogin();
        }

        //If running on device play videos
        function onDeviceReady() {
            //console.log($localStorage.intro);
            if ($localStorage.intro <= 1) {
                $window.plugins.orientationLock.lock('landscape');
                playInstructionsAndAds();
            } else {
                playAds();
            }
        }

        //Play local and web video
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

        //Play web video
        function playAds() {
            var options = {
                successCallback: function () {
                    console.log('web video completed');
                    $window.plugins.orientationLock.lock('portrait');
                    $window.plugins.orientationLock.unlock();
                    showLogin();
                },
                errorCallback: function (errMsg) {
                    console.log('Web video error: ' + errMsg);
                    $window.plugins.orientationLock.lock('portrait');
                    $window.plugins.orientationLock.unlock();
                    showLogin();
                },
                orientation: 'landscape',
                shouldAutoClose: true
            };
            $window.plugins.streamingMedia.playVideo(videoUrlWeb, options);
        }

        //Show login page
        function showLogin() {
            $timeout(function () {
                $scope.splash = true;
            });
        }

        //Modal controller for errors and successful login messages
        var ModalInstanceCtrl = function ($scope, $uibModalInstance, data) {
            $scope.data = data;
            $scope.close = function (/*result*/) {
                $uibModalInstance.close($scope.data);
            };
        };

        //Open modal
        $scope.open = function (data) {
            $scope.data = data;

            var modalInstance = $uibModal.open({
                templateUrl: 'modules/login/view/errormodal.html',
                controller: ModalInstanceCtrl,
                backdrop: true,
                keyboard: true,
                backdropClick: true,
                size: 'lg',
                resolve: {
                    data: function () {
                        return $scope.data;
                    }
                }
            });

            /*modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                //alert( $scope.selected);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });*/

            return modalInstance;
        }

        //Login with http request
        $scope.login = function () {
            $loading.start('login');
            $http.post(loginUrl, $scope.loginData).then(function (response) {
                $loading.finish('login');
                switch (response.data.status) {
                    //If wrong info show error
                    case 'USER_NOT_FOUND':
                        var data = {
                            boldTextTitle: '',
                            textAlert: 'Username or password is invalid.',
                            mode: 'danger'
                        }
                        var modal = $scope.open(data);
                        $timeout(function () { modal.close(); }, 3000);
                        break;
                    //If correct info show message and go to homepage
                    case 'OK':
                        $localStorage.username = $scope.loginData.username;
                        if ($scope.loginData.checkLogin === true) {
                            $localStorage.password = $scope.loginData.password;
                            $localStorage.checkLogin = true;
                        } else {
                            delete $localStorage.password;
                            delete $localStorage.checkLogin;
                        }
                        $state.go('homepage', { splash: true });
                        break;
                    //If server error show error message
                    default:
                        var data = {
                            boldTextTitle: '',
                            textAlert: 'Server error, please try again later.',
                            mode: 'danger'
                        }
                        var modal = $scope.open(data);
                        $timeout(function () { modal.close(); }, 3000);
                }

            });
        };

        //Registration via http request
        $scope.register = function () {
            //$scope.registrationData.birthdate = $scope.datepicker.date.toISOString().substring(0, 10);
            $scope.registrationData.birthdate = $scope.registrationData.birthdateObj.toISOString().substring(0, 10);

            var idx = _.findIndex($scope.checkEmail, function (o) { return o; });
            switch (idx) {
                case 0:
                    $scope.registrationData.emails.primary = $scope.registrationData.emails.personal;
                    break;
                case 1:
                    $scope.registrationData.emails.primary = $scope.registrationData.emails.organization;
                    break;
                default:
                    $scope.registrationData.emails.primary = $scope.registrationData.emails.others[idx - 2];
                    break;
            }

            idx = _.findIndex($scope.checkMobile, function (o) { return o; });
            switch (idx) {
                case 0:
                    $scope.registrationData.mobileNumbers.primary = $scope.registrationData.mobileNumbers.personal;
                    break;
                default:
                    $scope.registrationData.mobileNumbers.primary = $scope.registrationData.mobileNumbers.others[idx - 1];
                    break;
            }
            
            $loading.start('login');
            $http.post(registrationUrl, $scope.registrationData).then(function (response) {
                $loading.finish('login');
                switch (response.data.status) {
                    case 'USER_EXISTS':
                        var data = {
                            boldTextTitle: '',
                            textAlert: 'This username or email is already in use.',
                            mode: 'danger'
                        }
                        var modal = $scope.open(data);
                        $timeout(function () { modal.close(); }, 3000);
                        break;
                    case 'OK':
                        var data = {
                            boldTextTitle: '',
                            textAlert: 'Registration successful.',
                            mode: 'success'
                        }
                        var modal = $scope.open(data);
                        $timeout(function () { modal.close(); }, 3000);
                        $scope.switchLoginRegister();
                        break;
                    default:
                        var data = {
                            boldTextTitle: '',
                            textAlert: 'Server error, please try again later.',
                            mode: 'danger'
                        }
                        var modal = $scope.open(data);
                        $timeout(function () { modal.close(); }, 3000);
                }

            });
        };
        
    }
})();