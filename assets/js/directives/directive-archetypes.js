app.directive('archetypes', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/templates/ng-template-archetypes.html',
        scope: {
            character: "=",
            archetypes: "=",
            readonly: "=ngReadonly"
        },
        controller: ['$scope', '$element', function($scope, $element) {
            if ($scope.readonly) $scope.disabled = true;

            for (var i = 0; i < $scope.archetypes.length; i++) {
                var arch = $scope.archetypes[i];
                if (!$scope.character.archetypes[arch.trigram]) $scope.character.archetypes[arch.trigram] = 0;
            }

            $scope.isOP = function() {
                var score = 0;
                for (var i = 0; i < $scope.archetypes.length; i++) {
                    var arch = $scope.archetypes[i],
                        charArch = $scope.character.archetypes[arch.trigram];
                    if (charArch == 5) score += 6;
                    else if (charArch) score += charArch;
                }
                return score > 6;
            };

            if ($scope.readonly) {
                if ($scope.character.fightType == 'offense') $scope.fightType = 'Offensif';
                else if ($scope.character.fightType == 'defense') $scope.fightType = 'Défensif';
                else $scope.fightType = 'Hybride';
            }
        }]
    };
});