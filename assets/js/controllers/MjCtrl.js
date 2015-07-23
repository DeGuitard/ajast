app.controller('MjCtrl', ['$scope', '$mdDialog', 'timeService', 'playersService', '$translate', function($scope, $mdDialog, timeService, playersService, $translate) {
    $scope.init = function(archetypes, fight) {
        playersService.init(fight.groups, archetypes);
        timeService.init(fight);
        $scope.hasStarted = fight.time.hasStarted;

        $translate('fights.titles.fight', {shortid: fight.shortid.toUpperCase()}).then(function (title) { $scope.page.title = title; });

        if (!timeService.isFinished()) {
            $scope.contextualLinks.title = 'fights.menu.title';
            $scope.contextualLinks.links = [
                {text: 'fights.menu.createNpc', action: function() {
                    $mdDialog.show({
                        controller: 'CreatePlayerCtrl',
                        templateUrl: '/js/templates/ng-template-create-player.html'
                    });
                }},
                {text: 'fights.menu.cancel', url: '/fight/end/' + timeService.id(), hide: function() { return $scope.hasStarted; } },
                {text: 'fights.menu.end', url: '/fight/end/' + timeService.id(), hide: function() { return !$scope.hasStarted; } }
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