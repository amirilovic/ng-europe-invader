angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('PlayersSrv', [function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var players = [
            {id: 1, name: 'AngularJS', img: 'img/players/angularjs.png' },
            {id: 2, name: 'Ionic', img: 'img/players/ionic.png' },
            {id: 3, name: 'ES6', img: 'img/players/es6.png' }
        ];

        return {
            all: function () {
                return players;
            },
            get: function (index) {
                // Simple index lookup
                return players[index];
            }
        }
    }])
    .factory('MisslesSrv', [function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var players = [
            { name: 'beach-ball', img: 'img/balls/beach_ball.png' },
            { name: 'football-ball', img: 'img/balls/football_ball.png' },
            { name: 'tennis-ball', img: 'img/balls/tennis_ball.png' },
            { name: 'volley-ball', img: 'img/balls/volley_ball.png' }
        ];

        return {
            all: function () {
                return players;
            },
            get: function (index) {
                // Simple index lookup
                return players[index];
            }
        }
    }])
    .factory('EnemiesSrv', [function () {
        var enemies = [
            {
                "name": "Miško Hevery",
                "img": "img/avatars/misko.png",
                "boss": true
            },
            {
                "name": "Igor Minar",
                "img": "img/avatars/igor.png",
                "boss": true
            },
            {
                "name": "Vojta Jína",
                "img": "img/avatars/vojta.png",
                "boss": true
            },
            {
                "name": "Pete Bacon Darwin",
                "img": "img/avatars/pete.png"
            },
            {
                "name": "Jeffrey Cross",
                "img": "img/avatars/jeff.png"
            },
            {
                "name": "Tobias Bosch",
                "img": "img/avatars/tobias.png"
            },
            {
                "name": "John Lindquist",
                "img": "img/avatars/johnlin.png"
            },
            {
                "name": "Joel Hooks",
                "img": "img/avatars/joel.png"
            },
            {
                "name": "Chirayu Krishnappa",
                "img": "img/avatars/chirayu.png"
            },
            {
                "name": "Pawel Kozlowski",
                "img": "img/avatars/pawel.png"
            },
            {
                "name": "Matias Niemelä",
                "img": "img/avatars/matias.png"
            },
            {
                "name": "James Deboer",
                "img": "img/avatars/james.png"
            },
            {
                "name": "Brad Green",
                "img": "img/avatars/brad.png",
                "boss": true
            },
            {
                "name": "Douglas Duteil",
                "img": "img/avatars/douglas.png"
            },
            {
                "name": "Thierry Chatel",
                "img": "img/avatars/thierry.png"
            },
            {
                "name": "Lukas Ruebbelke",
                "img": "img/avatars/lukas.png"
            },
            {
                "name": "Rob Eisenberg",
                "img": "img/avatars/rob.png"
            },
            {
                "name": "Julien Bouquillon",
                "img": "img/avatars/julien.png"
            },
            {
                "name": "Max Lynch",
                "img": "img/avatars/max.png"
            },
            {
                "name": "Matthieu Lux",
                "img": "img/avatars/matthieu.png"
            },
            {
                "name": "Oliver Dore",
                "img": "img/avatars/oliver.png"
            },
            {
                "name": "Victor Berchet",
                "img": "img/avatars/victor.png"
            },
            {
                "name": "Rado Kirov",
                "img": "img/avatars/rado.png"
            },
            {
                "name": "Martin Gontovnikas",
                "img": "img/avatars/gonto.png"
            },
            {
                "name": "Andrew Joslin",
                "img": "img/avatars/andrew.png"
            },
            {
                "name": "Marcy Sutton",
                "img": "img/avatars/marcy.png"
            },
            {
                "name": "Jeremy Elbourn",
                "img": "img/avatars/jeremy.png"
            },
            {
                "name": "Matias Woloski",
                "img": "img/avatars/matiasw.png"
            },
            {
                "name": "Ari Lerner",
                "img": "img/avatars/ari.png"
            },
            {
                "name": "Pascal Precht",
                "img": "img/avatars/pascal.png"
            },
            {
                "name": "Carmen Popoviciu",
                "img": "img/avatars/carmen.png"
            },
            {
                "name": "Dave Smith",
                "img": "img/avatars/dave.png"
            },
            {
                "name": "Zack Brown",
                "img": "img/avatars/zack.png"
            }
        ];

        return {
            all: function () {
                return enemies;
            }
        }
    }])
    .factory('raf', ['$window', '$rootScope', function ($window, $rootScope) {
        return function (callback) {
            var fn = $window.requestAnimationFrame ||
                $window.webkitRequestAnimationFrame ||
                $window.mozRequestAnimationFrame ||
                function (callback) {
                    $timeout(callback, 1000 / 60);
                };
            fn(function () {
                callback(arguments);
                $rootScope.$$phase || $rootScope.$apply();
            });
        };

    }])
    .factory('rand', [function () {
        return function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };
    }]).factory('imgLoader', ['$q', '$document', function ($q, $document) {
        return function loadImage(src) {
            var deferred = $q.defer();
            var image = $document[0].createElement('img');

            image.crossOrigin = 'Anonymous';
            image.src = src;

            image.onload = function () {
                deferred.resolve(image);
            };

            image.onerror = function () {
                deferred.reject();
            };

            return deferred.promise;
        }
    }]).factory('pusher', [function () {

        Pusher.log = function (message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        };

        var pusher = new Pusher('967e7054e07b29586a07', {
            authEndpoint: "http://localhost:5000/pusher/auth",
            auth: {
                params: {
                    userID: 1
                }
            }
        });

        return pusher;

    }]);
