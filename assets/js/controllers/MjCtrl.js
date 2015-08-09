app.controller('MjCtrl', ['$scope', '$mdDialog', 'timeService', 'playersService', '$translate', '$http', '$mdToast', function($scope, $mdDialog, timeService, playersService, $translate, $http, $mdToast) {
    $scope.init = function(archetypes, fight) {
        playersService.init(fight.groups, archetypes);
        timeService.init(fight);
        $scope.hasStarted = fight.time.hasStarted;

        $scope.page.title =  $translate.instant('fights.titles.fight', {shortid: fight.shortid.toUpperCase()});

        if (!timeService.isFinished()) {
            $scope.endFight = function() {
                var id = timeService.id();
                $http.post('/fight/end', {id: id}).success(function() {
                    $scope.to('fights');
                }).error(function(err) {
                    $mdToast.show(
                        $mdToast.simple().content($translate.instant('fights.notices.error')).position('top right').hideDelay(5000)
                    );
                });
            };
            $scope.contextualLinks.title = 'fights.menu.title';
            $scope.contextualLinks.links = [
                {text: 'fights.menu.createNpc', action: function() {
                    $mdDialog.show({
                        controller: 'CreatePlayerCtrl',
                        templateUrl: '/js/templates/ng-template-create-player.html'
                    });
                }},
                {text: 'fights.menu.cancel', action: $scope.endFight, hide: function() { return $scope.hasStarted; } },
                {text: 'fights.menu.end', action: $scope.endFight, hide: function() { return !$scope.hasStarted; } }
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