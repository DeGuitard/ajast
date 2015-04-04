app.directive('timeline', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/templates/ng-template-timeline.html',
        scope: {
            character: "=",
            editable: "="
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.timelineGroups = new vis.DataSet([
                {id: 1, content: 'Histoire Personnelle'},
                {id: 2, content: 'Histoire d\'Eorzea'}
            ]);

            $scope.eorzeaHistory = [
                {id: 1, content: 'Guerre de l\'Automne', start: new Date(1468, 0, 1), className: 'history', group: 2},
                {id: 2, content: 'Invention de la barde de Chocobo', start: new Date(1469, 1, 1), className: 'history', group: 2},
                {id: 3, content: 'Ququruka invoque Barbatos quand son rituel tourne mal, et le scelle avec lui', start: new Date(1472, 5, 1), className: 'history', group: 2},
                {id: 4, content: 'Naissance de Solus zos Galvus', start: new Date(1483, 0, 1), end: new Date(1492, 0, 1), className: 'history', group: 2},
                {id: 5, content: 'Première cartographie d\'Eorzea par Roddard Ironheart', start: new Date(1506, 0, 1), className: 'history', group: 2},
                {id: 6, content: 'Fondation de l\'empire Garlemaldais sous Solus zos Galvus', start: new Date(1521, 0, 1), className: 'history', group: 2},
                {id: 7, content: 'Toto-Rak scellé par l\'Oracle', start: new Date(1469, 0, 1), className: 'history', group: 2},
                {id: 8, content: 'Le Roi Theodoric, d\'Ala Mhigo, interdit le culte de Rhalgr', start: new Date(1552, 0, 1), className: 'history', group: 2},
                {id: 9, content: 'Meutre et torture des disciples de Rhalgr', start: new Date(1552, 0, 1), className: 'history', group: 2},
                {id: 10, content: 'Invasion d\'Ala Mhigo', start: new Date(1557, 0, 1), className: 'history', group: 2},
                {id: 11, content: 'Combat entre Sir Alberic et Nidhogg', start: new Date(1557, 0, 1), className: 'history', group: 2},
                {id: 13, content: 'Destruction de la flotte garlemaldaise par le Gardien du Lac Migsormr', start: new Date(1562, 0, 1), className: 'history', group: 2},
                {id: 14, content: 'Invocation d\'Ifrit', start: new Date(1564, 0, 1), className: 'history', group: 2},
                {id: 15, content: 'Alliance entre Limsa Lominsa et les pirates', start: new Date(1572, 0, 1), className: 'history', group: 2},
                {id: 16, content: 'Nael van Darnus est vaincu', start: new Date(1572, 3, 1), className: 'history', group: 2},
                {id: 17, content: 'Bataille de Carteneau et libération de Bahamut', start: new Date(1572, 5, 1), className: 'history', group: 2}
            ];
            $scope.timelineItems = new vis.DataSet();
            $scope.timelineItems.add($scope.character.timeline);

            $scope.eorzeaHistoryVisible = false;
            $scope.toggleEorzeaHistory = function() {
                if ($scope.eorzeaHistoryVisible) {
                    for (i = 1; i <= 18; i++) {
                        $scope.timelineItems.remove(i);
                    }
                    $scope.timeline.setGroups(undefined);
                } else {
                    $scope.timelineItems.add($scope.eorzeaHistory);
                    $scope.timeline.setGroups($scope.timelineGroups);
                }
                $scope.eorzeaHistoryVisible = !$scope.eorzeaHistoryVisible;
            };

            // Adjusting the date ; the game has started in september, so our january is in eorzea a september.
            $scope.timelineToday = new Date();
            $scope.timelineToday.setFullYear(1577);
            $scope.timelineToday.setMonth($scope.timelineToday.getMonth() + Math.abs($scope.timelineToday.getMonth() - 9));

            var options = {
                    minHeight: '300px',
                    start: new Date(1571, 0, 0),
                    end: $scope.timelineToday,
                    min: new Date(1430, 0, 0),
                    max: new Date(1630, 0, 0),
                    orientation: 'top',
                    type: 'point',
                    editable: $scope.editable,
                    onUpdate: function (item, callback) {
                        item.content = prompt('Nouveau nom : ', item.content);
                        if (item.content != null) {
                            callback(item);
                        } else {
                            callback(null);
                        }
                    },
                    onAdd: function (item, callback) {
                        item.content = prompt('Nom de l\'événement : ', item.content);
                        item.group = 1;
                        if (item.content != null) {
                            callback(item);
                        } else {
                            callback(null);
                        }
                    }
                };
            $scope.timeline = new vis.Timeline(document.getElementById('timeline'), $scope.timelineItems, options);
            $scope.character.getTimeline = function() {
                return $scope.timelineItems.get({
                    filter: function(item) {
                        return (item.group == 1);
                    }
                });
            }
        }]
    };
});