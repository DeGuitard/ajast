app.directive('actionForm', function() {
    return {
        restrict: 'A',
        templateUrl: '/js/templates/ng-template-action-form.html',
        scope: { },
        controller: ['$scope', '$element', '$mdToast', 'timeService', 'playersService', function($scope, $element, $mdToast, timeService, playersService) {
            $scope.players = function() { return playersService.all(); };
            $scope.archetypes = playersService.archetypes();
            $scope.currentAction = function() { return timeService.currentAction(); };
            $scope.canRoll = function() { return timeService.canRoll(); };
            $scope.save = function() {
                timeService.saveActions(function() {
                    $mdToast.show(
                        $mdToast.simple().content('Action mise à jour.').position('top right').hideDelay(2000)
                    );
                });
            };
            $scope.roll = function() {
                timeService.roll(function() {
                    $mdToast.show(
                        $mdToast.simple().content('Dé lancé ! Résultat : ' + timeService.lastAction().roll).position('top right').hideDelay(2000)
                    );
                    $scope.setDefaultOptions();
                });
            };

            $scope.isArchetypeAvailable = function(archetype) {
                return $scope.currentAction().source.archetypes[archetype.trigram] > 0;
            };
            $scope.setDefaultOptions = function() {
                var defaultArchetype;
                for (var i = 0; i < $scope.archetypes.length; i++) {
                    if ($scope.isArchetypeAvailable($scope.archetypes[i])) {
                        defaultArchetype = $scope.archetypes[i];
                        break;
                    }
                }
                $scope.currentAction().archetype = defaultArchetype.trigram;
                $scope.currentAction().type = timeService.lastAction().type;
            }
        }]
    };
});