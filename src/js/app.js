// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'uiGmapgoogle-maps'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // Each tab has its own nav history stack:

            .state('game', {
                url: '/game',
                templateUrl: 'templates/tab-game.html',
                controller: 'GameCtrl'
            })

            .state('players', {
                url: '/players',
                templateUrl: 'templates/tab-players.html',
                controller: 'PlayersCtrl'

            })

            .state('player-detail', {
                url: '/players/:playerId',
                templateUrl: 'templates/player-detail.html',
                controller: 'PlayerDetailCtrl'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/tab-settings.html',
                controller: 'SettingsCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/game');

    });


document.addEventListener('ontouchmove', function (e) {
    e.preventDefault();
});

