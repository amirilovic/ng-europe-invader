angular.module('starter.controllers', [])
    .controller('GameCtrl', ['$scope', 'PlayersSrv', 'EnemiesSrv', 'rand', 'raf', 'imgLoader', '$q', '$rootScope', 'MisslesSrv', '$ionicLoading', '$ionicModal',
        function ($scope, PlayersSrv, EnemiesSrv, rand, raf, imgLoader, $q, $rootScope, MisslesSrv, $ionicLoading, $ionicModal) {
            var players = PlayersSrv.all();
            var enemies = EnemiesSrv.all();
            var missiles = MisslesSrv.all();
            var GAME_STATES = {
                LOADING: 'loading',
                PLAYING: 'playing',
                PAUSED: 'paused',
                GAME_OVER: 'gameOver'
            };
            var movementTypes = ['straight', 'zigzag', 'parallel', 'diagonal', 'zigzag'];
            var count = 5;
            var handlers = [];
            var valuePerHead = 10;

            $scope.gameSettings = {};

            $scope.pause = function () {
                pause();
                $scope.modal.show();
            };

            $scope.resume = function () {
                $scope.modal.hide();
                resume();
            };

            $scope.start = function () {
                $scope.modal.hide();
                startNewGame();
            };

            $scope.$on('$destroy', function () {
                handlers.forEach(function (h) {
                    h();
                })
            });

            handlers.push($rootScope.$on('game:missile', function (e, missle) {
                $scope.missiles.push(missle);
            }));

            handlers.push($rootScope.$on('game:missile:gone', function (e, missle) {
                var index = $scope.missiles.indexOf(missle);
                if (index > -1) {
                    $scope.missiles.splice(index, 1);
                }
            }));

            function gameOver () {
                $scope.gameState = GAME_STATES.GAME_OVER;
                $scope.modal.show();
                $rootScope.$emit('game:over');
            };

            function pause() {
                $scope.gameState = GAME_STATES.PAUSED;
                $rootScope.$emit('game:pause');
            }

            function resume() {
                $scope.gameState = GAME_STATES.PLAYING;
                updateView();
                $rootScope.$emit('game:resume');
            }

            function startNewGame() {
                var player = angular.copy(players[rand(0, players.length)]);
                $scope.gameState = GAME_STATES.PLAYING;
                $scope.missiles = [];
                $scope.currentEnemies = [];
                $scope.players = [player];
                $scope.currentPlayer = player;
                $scope.currentPlayer.score = 0;
                $scope.startFrom = 50;
                $scope.movementType = movementTypes[rand(0, movementTypes.length)];
                $scope.map = {
                    center: {
                        latitude: 48.859537,
                        longitude: 2.339163
                    },
                    zoom: 15
                };

                updateView();

                $rootScope.$emit('game:started');
            }

            function loadImages() {

                var urls = [];

                for (var i = 0; i < enemies.length; i++) {
                    urls.push(enemies[i].img);
                }

                for (var i = 0; i < players.length; i++) {
                    urls.push(players[i].img);
                }

                for (var i = 0; i < missiles.length; i++) {
                    urls.push(missiles[i].img);
                }

                var promises = [];
                urls.forEach(function (u) {
                    promises.push(imgLoader(u));
                });

                return $q.all(promises);
            }

            function createNewEnemyWave() {
                $scope.currentEnemies = getRandEnemies(count, enemies);
                $scope.startFrom = rand(0, 4) * $scope.gameSettings.size.width / 4;
                $scope.movementType = movementTypes[rand(0, movementTypes.length)];
            }

            function getRandEnemies(count, all) {
                var result = [];
                while (result.length < count) {
                    var index = rand(0, all.length);
                    if (result.indexOf(index) == -1) {
                        result.push(index);
                    }
                }

                for (var i = 0; i < result.length; i++) {
                    result[i] = angular.copy(all[result[i]]);
                }

                return result;
            }

            function allEnemiesGone() {
                for (var i = 0; i < $scope.currentEnemies.length; i++) {
                    if (!$scope.currentEnemies[i].gone) {
                        return false;
                    }
                }
                return true;
            }

            function addPlayerScore(id, value) {
                for (var i = 0; i < $scope.players.length; i++) {
                    var p = $scope.players[i];
                    if (p.id == id) {
                        p.score += value;
                        break;
                    }
                }
            }

            function collisionDetection() {

                if (!$scope.players || !$scope.currentEnemies) {
                    return;
                }

                var dead = [];

                for (var i = 0; i < $scope.players.length; i++) {
                    var p = $scope.players[i];
                    for (var j = 0; j < $scope.currentEnemies.length; j++) {
                        var e = $scope.currentEnemies[j];
                        if (p.x < e.x + e.width &&
                            p.x + p.width > e.x &&
                            p.y < e.y + e.height &&
                            p.height + p.y > e.y) {
                            p.dead = true;
                            dead.push(p);
                            gameOver();
                        }
                    }
                }

                for (var i = 0; i < $scope.missiles.length; i++) {
                    var p = $scope.missiles[i];
                    for (var j = 0; j < $scope.currentEnemies.length; j++) {
                        var e = $scope.currentEnemies[j];
                        if (p.x < e.x + e.width &&
                            p.x + p.width > e.x &&
                            p.y < e.y + e.height &&
                            p.height + p.y > e.y) {
                            if (!e.boss || e.hits == 2) {
                                e.dead = true;
                                p.dead = true;

                                addPlayerScore(p.playerId, valuePerHead);

                                dead.push(e);
                            }
                            else {
                                if (!e.hits) {
                                    e.hits = 0;
                                }
                                e.hits++;
                            }
                            p.dead = true;
                            dead.push(p);
                        }
                    }
                }

                for (var i = 0; i < dead.length; i++) {
                    var d = dead[i];
                    var index;
                    if ((index = $scope.players.indexOf(d)) >= 0) {
                        $scope.players.splice(index, 1);
                    }
                    else if ((index = $scope.currentEnemies.indexOf(d)) >= 0) {
                        $scope.currentEnemies.splice(index, 1);
                    }
                    else if ((index = $scope.missiles.indexOf(d)) >= 0) {
                        $scope.missiles.splice(index, 1);
                    }
                }
            }

            function moveMap() {
                $scope.map.center.latitude += 0.00001;
            }

            function updateView() {
                if ($scope.gameState != GAME_STATES.PLAYING) {
                    return;
                }

                raf(function () {
                    collisionDetection();
                    moveMap();

                    if (allEnemiesGone()) {
                        createNewEnemyWave();
                    }

                    $rootScope.$emit('game:update');

                    updateView();
                });
            }

            function activate() {

                $scope.gameState = 'loading';
                $ionicLoading.show({template: 'Loading...'});

                $ionicModal.fromTemplateUrl('templates/home.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                loadImages().finally(function () {
                    $scope.loading = false;
                    $ionicLoading.hide();
                });
            }

            activate();

        }])
    .controller('PlayersCtrl', function ($scope, PlayersSrv) {
        $scope.players = PlayersSrv.all();
    })

    .controller('PlayerDetailCtrl', function ($scope, $stateParams, PlayersSrv) {
        $scope.player = PlayersSrv.get($stateParams.playerId);
    })

    .controller('SettingsCtrl', function ($scope) {
    });
