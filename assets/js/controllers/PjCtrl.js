app.controller('PjCtrl', ["$scope", "$mdToast", "timeService", "playersService", function($scope, $mdToast, timeService, playersService) {
    $scope.init = function(archetypes, fight) {
        playersService.init(fight.groups, archetypes);
        timeService.init(fight);
        $scope.page.title = "COMBAT #" + fight.shortid.toUpperCase();
        io.socket.on("fight", function(event) {
            if (event.verb == "updated") {
                var fight = event.data.fight,
                    action = event.data.action;

                if (fight && fight.time && fight.groups) {
                    timeService.update(fight);
                    playersService.update(fight.groups);
                    $scope.$digest();

                    var msg = 'Mise à jour reçue.';
                    if (action == 'roll') msg = "Un dé a été lancé.";
                    if (action == 'refresh') msg = "Liste des tours recalculée.";
                    $mdToast.show(
                        $mdToast.simple().content(msg).position('top right').hideDelay(2000)
                    );
                }
            }
        });
        io.socket.get("/api/fight/" + fight.id, function(resData, jwres) {});
    };
}]);