app.directive('timeBar', ["$window", function($window) {
    return {
        restrict: 'E',
        templateUrl: '/js/templates/ng-template-time-bar.html',
        scope: { },
        controller: ['$scope', '$element', 'timeService', 'playersService', function($scope, $element, timeService, playersService) {
            $scope.actions = timeService.actions();
            $scope.current = timeService.current();
            $scope.rollback = function(index) {
                timeService.rollback(index);
                var currentAction = timeService.currentAction(),
                    players = playersService.all();
                if (currentAction.target) {
                    for (var i = 0; i < players.length; i++) {
                        if (currentAction.target.fullName == players[i].fullName) {
                            currentAction.target = players[i];
                        }
                    }
                }
            };

            $scope.$watch(function() {
                return timeService.actions();
            }, function (value) {
                $scope.actions = timeService.actions();
                $scope.updateOffset();
            });

        }],

        link: function(scope, element) {
            var BLOCK_WIDTH = 100,
                BAR_WIDTH = element[0].getElementsByClassName('time-bar')[0].offsetWidth,
                initPos = -BLOCK_WIDTH*(scope.actions.length-(BAR_WIDTH/BLOCK_WIDTH/2)),
                pos = initPos + (BLOCK_WIDTH * scope.current.index) - BLOCK_WIDTH/3;
            scope.offset = {};

            scope.$watch('current.index', function(value) {
                var pos = initPos + (BLOCK_WIDTH * scope.current.index) - BLOCK_WIDTH/3;
                scope.offset.left = pos + "px";
            });

            scope.updateOffset = function() {
                BAR_WIDTH = element[0].getElementsByClassName('time-bar')[0].offsetWidth;
                initPos = -BLOCK_WIDTH*(scope.actions.length-(BAR_WIDTH/BLOCK_WIDTH/2));
                pos = initPos + (BLOCK_WIDTH * scope.current.index) - BLOCK_WIDTH/3;
                scope.offset.left = pos + "px";
            };

            angular.element($window).bind('resize', function() {
                scope.updateOffset();
                scope.$digest();
            });
        }
    };
}]);