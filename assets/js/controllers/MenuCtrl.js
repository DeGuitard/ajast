app.controller('MenuCtrl', ['$scope', '$mdDialog', 'timeService', 'playersService', function($scope, $mdDialog, timeService, playersService) {
    $scope.showCreatePlayer = function(ev) {
        $mdDialog.show({
            controller: 'CreatePlayerCtrl',
            templateUrl: '/js/templates/ng-template-create-player.html',
            targetEvent: ev
        });
    };
}]);