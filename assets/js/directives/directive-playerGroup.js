app.directive('playerGroup', function() {
    return {
        restrict: 'A',
        scope: {
            groupCode: "="
        },
        templateUrl: '/js/templates/ng-template-player-group.html',
        controller: ['$scope', '$element', '$attrs', 'playersService', 'timeService', function($scope, $element, $attrs, playersService, timeService) {
            $scope.groupCode = $attrs.groupCode;

            $scope.save = function() { playersService.save(); };
            $scope.group = function() {
                return $scope.groupCode == 'A' ? playersService.groupA() : playersService.groupB();
            };
            $scope.addPlayer = function() {
                playersService.addTo($scope.newPlayer, $scope.group());
                $scope.searchString = '';
            };
            $scope.findPlayers = function(term) { return playersService.find(term); };
            $scope.readOnly = function() { return $attrs.readOnly || timeService.isFinished(); }
        }]
    };
});