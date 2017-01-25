/*
This is the controller for AR scan
*/
(function () {
    'use strict';

    angular
        .module('scan', [])
        .controller('scanCtrl', scanCtrl);

    scanCtrl.$inject = ['$rootScope', '$scope', '$state'];

    function scanCtrl($rootScope, $scope, $state) {
        //Set all vuforia functions
        var vuforia = {
            // Vuforia license
            vuforiaLicense: 'ARWew8T/////AAAAAFfGjmmevkaStzS/ubwzoq41fZDzeg7vVS4hFrktpLuHbBXUVEe7yawMjAXfruf810aenI4bFAH4pHgM/D5ErIyLhsn6ct1qnMRGJy2tqcRsTOHZuqnEMRLiCwtnANvO8qxN5DXztFJSqCgrW2can9708d5o32QvsB/T6eD1BKao9ZIMXApddusf7NLizCHkxAESC7+UQVPZYeiwr1VoJqbyhvaxd1CdDo55/wfGgkuQQenFsRrAnppQcPyYn0C51GmgdCa8JY6ynp6jI5UWMC7TIIji64rO5PSkp3Tn0lRsifD+2MyOCm3jAhrpF42wPaWa/XG3qbXUvXlatcDjVJDM4+prw3U2iOl+xW2cdvBX',
            // Are we launching Vuforia with simple options?
            simpleOptions: null,
            // Which images have we matched?
            matchedImages: [],
            // Application Constructor
            initialize: function () {
                this.bindEvents();
            },
            // Bind Event Listeners
            //
            // Bind any events that are required on startup. Common events are:
            // 'load', 'deviceready', 'offline', and 'online'.
            bindEvents: function () {
                var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
                if (app) {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                }
            },
            // deviceready Event Handler
            //
            // The scope of 'this' is the event. In order to call the 'receivedEvent'
            // function, we must explicitly call 'app.receivedEvent(...);'
            onDeviceReady: function () {
                vuforia.receivedEvent('deviceready');
                //Jump start Vuforia without overlay text after uses logins.
                vuforia.startVuforia(true, undefined, null);
            },
            // Update DOM on a Received Event
            receivedEvent: function (id) {
                // Start Vuforia using simple options
                document.getElementById('start-vuforia').onclick = function () {
                    vuforia.startVuforia(true);
                };

                // Start Vuforia with no overlay text
                document.getElementById('start-vuforia-with-no-overlay-text').onclick = function () {
                    vuforia.startVuforia(true, undefined, null)
                };

                // Start Vuforia with simple options and try to close it after 5 seconds
                document.getElementById('start-and-stop-vuforia').onclick = function () {
                    vuforia.startVuforia(true);

                    console.log('Starting timer...');

                    // Wait for a timeout, then automatically stop Vuforia
                    setTimeout(function () {
                        vuforia.stopVuforia();
                    }, 5000);
                };

                // Attempt to stop Vuforia
                document.getElementById('stop-vuforia').onclick = function () {
                    vuforia.stopVuforia();
                };

                // Start Vuforia with full options and keep it open when images are found
                document.getElementById('start-vuforia-and-keep-open').onclick = function () {
                    vuforia.startVuforia(false);
                };

                //start-vuforia-and-recognise-in-sequence

                // Start Vuforia with full options and keep it open when images are found
                document.getElementById('start-vuforia-and-recognise-in-sequence').onclick = function () {
                    var imagesMatched = 0,
                        imageSequence = ['iceland', ['canterbury-grass', 'brick-lane'], 'iceland'];

                    var successCallback = function (data) {
                        console.log('Found ' + data.result.imageName);

                        imagesMatched++;

                        vuforia.playSound(); // Play a sound so that the user has some feedback

                        // Are there more images to match?
                        if (imagesMatched < imageSequence.length) {
                            var newTargets = [imageSequence[imagesMatched]];

                            console.log('Updating targets to: ' + newTargets);

                            navigator.VuforiaPlugin.updateVuforiaTargets(
                                newTargets,
                                function (data) {
                                    console.log(data);
                                    console.log('Updated targets');
                                },
                                function (data) {
                                    alert("Error: " + data);
                                }
                            );
                        } else {
                            navigator.VuforiaPlugin.stopVuforia(function () {
                                alert("Congratulations!\nYou found all three images!");
                            },
                            vuforia.errorHandler);
                        }
                    };

                    var options = {
                        databaseXmlFile: 'PluginTest.xml',
                        targetList: ['iceland'],
                        overlayMessage: 'Scan images in the order: \'iceland\', (\'canterbury-grass\' or \'brick-lane\'), then \'iceland\'.',
                        vuforiaLicense: vuforia.vuforiaLicense,
                        autostopOnImageFound: false
                    };

                    // Start Vuforia with our options
                    navigator.VuforiaPlugin.startVuforia(
                        options,
                        successCallback,
                        function (data) {
                            alert("Error: " + data);
                        }
                    );
                };
            },
            // Start the Vuforia plugin
            startVuforia: function (simpleOptions, successCallback, overlayMessage, targets) {
                var options;

                if (typeof overlayMessage == 'undefined')
                    overlayMessage = 'Point your camera at a test image...';

                if (typeof targets == 'undefined')
                    targets = ['stones', 'chips'];

                // Reset the matched images
                vuforia.matchedImages = [];

                // Set the global simpleOptions flag
                vuforia.simpleOptions = simpleOptions;

                // Log out wether or not we are using simpleOptions
                console.log('Simple options: ' + !!vuforia.simpleOptions);

                // Load either simple, or full options
                if (!!vuforia.simpleOptions) {
                    options = {
                        databaseXmlFile: 'www/targets/StonesAndChips.xml',
                        targetList: targets,
                        overlayMessage: overlayMessage,
                        vuforiaLicense: vuforia.vuforiaLicense
                    };
                } else {
                    options = {
                        databaseXmlFile: 'www/targets/StonesAndChips.xml',
                        targetList: targets,
                        vuforiaLicense: vuforia.vuforiaLicense,
                        overlayMessage: overlayMessage,
                        showDevicesIcon: true,
                        showAndroidCloseButton: true,
                        autostopOnImageFound: false
                    };
                }

                // Start Vuforia with our options
                navigator.VuforiaPlugin.startVuforia(
                    options,
                    successCallback || vuforia.vuforiaMatch,
                    function (data) {
                        alert("Error: " + data);
                    }
                );
            },
            vuforiaMatch: function (data) {
                // To see exactly what `data` can contain, see 'Success callback `data` API' within the plugin's documentation.
                console.log(data);

                // Have we found an image?
                if (data.status.imageFound) {
                    // If we are using simple options, alert the image name
                    if (vuforia.simpleOptions) {
                        alert("Image name: " + data.result.imageName);
                    } else { // If we are using full options, add the image to an array of images matched
                        vuforia.matchedImages.push(data.result.imageName);
                        vuforia.playSound(); // Play a sound so that the user has some feedback
                    }
                }
                    // Are we manually closing?
                else if (data.status.manuallyClosed) {
                    // Let the user know they've manually closed Vuforia
                    alert("User manually closed Vuforia!");

                    // If we've matched any images, tell the user what we found
                    if (vuforia.matchedImages.length) {
                        alert("Found:\n" + vuforia.matchedImages);
                    }
                }
            },
            // Stop the Vuforia plugin
            stopVuforia: function () {
                navigator.VuforiaPlugin.stopVuforia(function (data) {
                    console.log(data);

                    if (data.success == 'true') {
                        alert('TOO SLOW! You took too long to find an image.');
                    } else {
                        alert('Couldn\'t stop Vuforia\n' + data.message);
                    }
                }, function (data) {
                    console.log("Error stopping Vuforia:\n" + data);
                });
            },
            // Play a bell sound
            playSound: function (resumeTrackers) {
                // Where are we playing the sound from?
                var soundURL = vuforia.getMediaURL("sounds/sound.wav");

                // Setup the media object
                var media = new Media(soundURL, function () {
                    console.log('Sound Played');

                    navigator.VuforiaPlugin.startVuforiaTrackers(
                        function () {
                            console.log('Started tracking again')
                        },
                        function () {
                            console.log('Could not start tracking again')
                        }
                    );
                }, vuforia.mediaError);
                // Play the sound
                media.play();
            },
            // Get the correct media URL for both Android and iOS
            getMediaURL: function (s) {
                if (device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
                return s;
            },
            // Handle a media error
            mediaError: function (e) {
                alert('Media Error');
                alert(JSON.stringify(e));
            }
        };
        vuforia.initialize();
    }
})();