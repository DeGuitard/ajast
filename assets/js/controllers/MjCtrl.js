app.controller('MjCtrl', ["$scope", "$mdDialog", "timeService", "playersService", function($scope, $mdDialog, timeService, playersService) {
    $scope.init = function(archetypes, fight) {
        playersService.init(fight.groups, archetypes);
        timeService.init(fight);
        $scope.hasStarted = fight.time.hasStarted;

        $scope.page.title = "Combat #" + fight.shortid.toUpperCase();

        if (!timeService.isFinished()) {
            $scope.contextualLinks.title = "Mon combat";
            $scope.contextualLinks.links = [
                {text: "Créer un PNJ", action: function() {
                    $mdDialog.show({
                        controller: 'CreatePlayerCtrl',
                        templateUrl: '/js/templates/ng-template-create-player.html'
                    });
                }},
                {text: "Annuler le combat", url: "/fight/end/" + timeService.id(), hide: function() { return $scope.hasStarted; } },
                {text: "Terminer le combat", url: "/fight/end/" + timeService.id(), hide: function() { return !$scope.hasStarted; } }
            ];
        }
    };
    $scope.group = function(code) { return code == 'A' ? playersService.groupA() : playersService.groupB() };

    $scope.canStart = function() { return playersService.canStart(); };
    $scope.isFinished = function() { return timeService.isFinished(); };
    $scope.start = function() {
        timeService.start(function() {
            $scope.hasStarted = true;
        });
    };
}]);