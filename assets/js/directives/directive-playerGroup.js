app.directive('playerGroup', function() {
    return {
        restrict: 'A',
        scope: {
            groupCode: "="
        },
        templateUrl: '/js/templates/ng-template-player-group.html',
        controller: ['$scope', '$element', '$attrs', '$timeout', 'playersService', 'timeService', function($scope, $element, $attrs, $timeout, playersService, timeService) {
            $scope.groupCode = $attrs.groupCode;

            $scope.group = function() {
                return $scope.groupCode == 'A' ? playersService.groupA() : playersService.groupB();
            };
            $scope.addPlayer = function() {
                playersService.addTo($scope.newPlayer, $scope.group());
                $timeout( function() { $scope.$$childHead.$mdAutocompleteCtrl.clear(); },100);
            };
            $scope.enablePlayer = function(player) {
                playersService.enablePlayer(player);
            };
            $scope.disablePlayer = function(player) {
                playersService.disablePlayer(player);
            };
            $scope.findPlayers = function(term) { return playersService.find(term); };
            $scope.readOnly = function() { return $attrs.readOnly || timeService.isFinished(); }
        }]
    };
});