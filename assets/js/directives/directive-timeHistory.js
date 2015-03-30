app.directive('timeHistory', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/templates/ng-template-time-history.html',
        scope: { },
        controller: ['$scope', '$element', 'timeService', function($scope, $element, timeService) {
            $scope.actions = function() { return timeService.actions() };
        }]
    };
});