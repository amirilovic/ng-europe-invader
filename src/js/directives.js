angular.module('starter')
    .directive('invGame', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope: {
                model: '='
            },
            link: function (scope, element) {
                var container = element.parent().parent()[0];
                var size = {
                    width: container.clientWidth,
                    height: container.clientHeight
                };
                element[0].style.height = size.height - 93 + 'px';
                element[0].style.width = size.width + 'px';
                scope.model.size = size;
            }
        }
    }])
    .directive('invPlayer', ['$ionicGesture', '$rootScope', 'MisslesSrv', 'rand', function ($ionicGesture, $rootScope, MisslesSrv, rand) {
        return{
            restrict: 'E',
            templateUrl: 'templates/player.html',
            scope: {
                model: '='
            },
            link: function (scope, element) {
                scope.model.x = 0;
                scope.model.y = 0;
                scope.model.width = 50;
                scope.model.height = 50;
                function getStypePosition() {
                    return 'translate3d(' + scope.model.x + 'px, ' + scope.model.y + 'px, 0)';
                }

                function getGameSize() {
                    var gameEl = element.parent().parent()[0];
                    return {
                        width: gameEl.clientWidth,
                        height: gameEl.clientHeight
                    }
                }

                function getRandMissile() {
                    var missiles = MisslesSrv.all();
                    var missle = missiles[rand(0, missiles.length)];

                    return angular.copy(missle);
                }

                var onMissleHandler = _.debounce(function () {

                    if (!scope.isFiring || scope.model.dead) {
                        return;
                    }

                    var missle = getRandMissile();
                    missle.x = scope.model.x + scope.model.width / 2 - 15;
                    missle.y = scope.model.y;
                    missle.width = 30;
                    missle.height = 30;
                    missle.playerId = scope.model.id;
                    $rootScope.$emit('game:missile', missle);

                    onMissleHandler();
                }, 500);

                function dragFn(e) {
                    var x = e.gesture.touches[0].clientX;
                    var y = e.gesture.touches[0].clientY;
                    var gameSize = getGameSize();
                    scope.model.x = x - scope.model.width / 2;
                    scope.model.y = y - scope.model.height / 2 - 45;

                    var transform = getStypePosition();
                    scope.style = {
                        '-webkit-transform': transform,
                        'transform': transform
                    };
                }

                function touchStartHandler() {
                    scope.isFiring = true;
                    onMissleHandler();
                }

                function touchEndHandler() {
                    scope.isFiring = false;
                }

                element.on('touchstart', touchStartHandler);
                element.on('mousedown', touchStartHandler);

                element.on('touchend', touchEndHandler);
                element.on('mouseup', touchEndHandler);

                scope.$on('$destroy', function () {
                    $ionicGesture.off(dragGesture, 'drag', dragFn);
                    element.off('touchstart', touchStartHandler);
                    element.off('touchEndstart', touchEndHandler);
                });
                var dragGesture = $ionicGesture.on('drag', dragFn, element);

                var gameSize = getGameSize();
                scope.model.x = gameSize.width / 2 - scope.model.width / 2;
                scope.model.y = gameSize.height - scope.model.height - 110;
                var transform = getStypePosition();

                scope.style = {
                    '-webkit-transform': transform,
                    'transform': transform
                };

            }
        }

    }])
    .
    directive('invEnemy', ['raf', 'rand', '$timeout', '$rootScope', function (raf, rand, $timeout, $rootScope) {
        return{
            restrict: 'E',
            templateUrl: 'templates/enemy.html',
            scope: {
                model: '=',
                movementType: '@',
                delay: '@',
                startFrom: '@',
                enemyCount: '@',
                index: '@'
            },
            link: function (scope, element) {
                var xIsCalculated, handlers = [];
                var delay = parseInt(scope.delay);
                scope.model.x = parseInt(scope.startFrom);
                scope.index = parseInt(scope.index);
                scope.enemyCount = parseInt(scope.enemyCount);
                scope.startFrom = parseInt(scope.startFrom);
                scope.model.width = element[0].clientWidth || 50;
                scope.model.height = element[0].clientHeight || 50;

                if(scope.model.boss) {
                    element.addClass('boss');
                    scope.model.width = 80;
                    scope.model.height = 80;
                }

                scope.model.y = -100;
                if (scope.movementType == 'parallel') {
                    delay = 0;
                }


                function getGameSize() {
                    var gameEl = element.parent().parent()[0];
                    return {
                        width: gameEl.clientWidth,
                        height: gameEl.clientHeight
                    }
                }

                var gameSize = getGameSize();


                function getStypePosition() {
                    return 'translate3d(' + scope.model.x + 'px, ' + scope.model.y + 'px, 0)';
                }

                function getRandDirection() {
                    var r = rand(0, 1);
                    return !!r ? 'right' : 'left';
                }

                function move() {
                    if (scope.model.gone) {
                        $rootScope.$emit('game:enemy:gone', scope.model)
                        return;
                    }

                    if (scope.movementType == 'straight') {
                        scope.model.y += 2;
                    }
                    else if (scope.movementType == 'zigzag') {
                        scope.direction = scope.direction || getRandDirection();
                        scope.model.y += 2;
                        if (scope.direction == 'right') {
                            scope.model.x += 2;
                        }
                        else {
                            scope.model.x -= 2;
                        }

                        if (scope.model.x >= gameSize.width) {
                            scope.direction = 'left';
                        }
                        else if (scope.model.x <= 0) {
                            scope.direction = 'right';
                        }
                    }
                    else if (scope.movementType == 'parallel' || scope.movementType == 'diagonal') {
                        scope.index = parseInt(scope.index);
                        scope.enemyCount = parseInt(scope.enemyCount);
                        scope.startFrom = parseInt(scope.startFrom);
                        var width = scope.model.width;
                        var middle = Math.ceil(scope.enemyCount / 2);
                        var index = scope.index;
                        var offset = index - middle;
                        if (scope.startFrom < middle * width) {
                            scope.startFrom = middle * width;
                        }
                        else if (scope.startFrom + middle * width > gameSize.width) {
                            scope.startFrom = gameSize.width - middle * width;
                        }
                        var newX;
                        if (!xIsCalculated) {
                            newX = scope.startFrom + (offset * width)
                            scope.model.x = newX;
                            xIsCalculated = true;
                        }
                        scope.model.y += 2;
                    }

                    if (scope.model.y - 20 > gameSize.height) {
                        scope.model.gone = true;
                        return;
                    }

                    var transform = getStypePosition();
                    scope.style = {
                        '-webkit-transform': transform,
                        'transform': transform
                    };
                }

                $timeout(function () {
                    handlers.push($rootScope.$on('game:update', function () {
                        move();
                    }));
                }, delay);



                scope.$on('$destroy', function () {
                    handlers.forEach(function (h) {
                        h();
                    })
                });
            }
        }

    }]).
    directive('invMissile', ['raf', '$rootScope', function (raf, $rootScope) {
        return{
            restrict: 'E',
            scope: {
                model: '='
            },
            templateUrl: 'templates/missile.html',
            link: function (scope, element) {

                var handlers = [];

                function getGameSize() {
                    var gameEl = element.parent().parent()[0];
                    return {
                        width: gameEl.clientWidth,
                        height: gameEl.clientHeight
                    }
                }

                var gameSize = getGameSize();

                function getStypePosition() {
                    return 'translate3d(' + scope.model.x + 'px, ' + scope.model.y + 'px, 0)';
                }


                function move() {
                    if (scope.model.gone) {
                        return;
                    }

                    scope.model.y -= 10;

                    if (scope.model.y + 20 < 0) {
                        scope.model.gone = true;
                        $rootScope.$emit('game:missile:gone', scope.model);
                        return;
                    }

                    var transform = getStypePosition();
                    scope.style = {
                        '-webkit-transform': transform,
                        'transform': transform
                    };
                }

                handlers.push($rootScope.$on('game:update', function () {
                    move();
                }));

                scope.$on('$destroy', function () {
                    handlers.forEach(function (h) {
                        h();
                    })
                });
            }
        }

    }]);