app.directive('archetypes', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/templates/ng-template-archetypes.html',
        scope: {
            character: "=",
            archetypes: "=",
            readonly: "=ngReadonly",
            fightOnly: "="
        },
        controller: ['$scope', '$element', function($scope, $element) {
            if ($scope.readonly) $scope.disabled = true;
            if ($scope.fightOnly) $scope.fightOnly = true;

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
                if ($scope.character.fightType == 'offense') $scope.fightType = 'archetypes.fightStyle.offensive';
                else if ($scope.character.fightType == 'defense') $scope.fightType = 'archetypes.fightStyle.defensive';
                else $scope.fightType = 'archetypes.fightStyle.hybrid';
            }

            // HARVEST AND CRAFT SKILLS
            $scope.crafts = [
                {trigram: "ALC"}, {trigram: "ARM"}, {trigram: "BSM"},
                {trigram: "CRP"}, {trigram: "CUL"}, {trigram: "GSM"},
                {trigram: "LTW"}, {trigram: "WVR"}
            ];
            $scope.harvesters = [
                {trigram: "BTN"}, {trigram: "FSH"}, {trigram: "MIN"}
            ];

            for (var i = 0; i < $scope.crafts.length; i++) {
                var craft = $scope.crafts[i];
                if (!$scope.character.crafts[craft.trigram]) $scope.character.crafts[craft.trigram] = 0;
            }

            for (var i = 0; i < $scope.harvesters.length; i++) {
                var harvest = $scope.harvesters[i];
                if (!$scope.character.harvesters[harvest.trigram]) $scope.character.harvesters[harvest.trigram] = 0;
            }

            $scope.isCraftOrHarvestOP = function() {
                var score = 0, talents = $scope.crafts.concat($scope.harvesters);
                for (var i = 0; i < talents.length; i++) {
                    var talent = talents[i],
                        craftLvl = $scope.character.crafts[talent.trigram],
                        harvestLvl = $scope.character.harvesters[talent.trigram];
                    if (craftLvl) score += craftLvl;
                    else if (harvestLvl) score += harvestLvl;
                }
                return score > 9;
            };

            $scope.isHarvester = function() {
                var isHarvester = false;
                for (var i = 0; i < $scope.harvesters.length; i++) {
                    var trigram = $scope.harvesters[i].trigram;
                    if ($scope.character.harvesters[trigram]) return true;
                }
                return false;
            };

            $scope.isCrafter = function() {
                var isCrafter = false;
                for (var i = 0; i < $scope.crafts.length; i++) {
                    var trigram = $scope.crafts[i].trigram;
                    if ($scope.character.crafts[trigram]) return true;
                }
                return false;
            }
        }]
    };
});