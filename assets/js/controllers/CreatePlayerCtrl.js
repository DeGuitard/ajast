app.controller('CreatePlayerCtrl', ["$scope", '$mdDialog', 'playersService', function($scope, $mdDialog, playersService) {
    $scope.player = {archetypes: {}};
    $scope.archetypes = playersService.archetypes();

    $scope.create = function() {
        playersService.create($scope.player);
        $mdDialog.hide();
    }
}]);