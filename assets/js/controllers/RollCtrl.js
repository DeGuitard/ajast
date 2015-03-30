app.controller('RollCtrl', ['$scope', '$http', '$mdToast', function($scope, $http, $mdToast) {
    $scope.page.title = 'Jets de dés';
    $scope.newRoll = {faces: 100};

    io.socket.on("roll", function(event) {
        if (event.verb == "created") {
            $scope.rolls.unshift(event.data);
            $mdToast.show(
                $mdToast.simple().content("Un dé a été lancé !").position('top right').hideDelay(2000)
            );

        }
    });

    io.socket.get("/api/roll/", function(data, jwres) {
        $scope.rolls = data;
        $scope.$digest();
    });

    $scope.roll = function() {
        $http.post('/api/roll', $scope.newRoll).error(function(err) {
            $mdToast.show(
                $mdToast.simple().content("Erreur ! " + err).position('top right').hideDelay(2000)
            );
        });
    };

    $scope.dateToStr = function(timestamp) {
        var date = new Date(timestamp);
        return "Le " + ("00" + date.getDate()).slice(-2) + "/"
            + ("00" + (date.getMonth() + 1)).slice(-2) + " à "
            + ("00" + date.getHours()).slice(-2) + ":"
            + ("00" + date.getMinutes()).slice(-2) + ":"
            + ("00" + date.getSeconds()).slice(-2) + "";
    }
}]);