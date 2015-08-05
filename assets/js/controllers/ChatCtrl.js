app.controller('ChatCtrl', ['$scope', '$http', '$mdToast', '$translate', function($scope, $http, $mdToast, $translate) {
    $scope.page.title = 'chat.titles.page';
    $scope.messages = [];
    $scope.offset = 15;

    io.socket.on('chatmsg', function(event) {
        if (event.verb == 'created') {
            $scope.messages.unshift(event.data);
        }
    });

    io.socket.get('/api/chat/', function(data, jwres) {
        $scope.messages = data;
        $scope.$digest();
    });

    $scope.loadMore = function() {
        $scope.loading = true;
        $http.post('/api/chat/next', {offset: $scope.offset}).success(function(results) {
            $scope.offset += 15;
            $scope.loading = false;
            for (var i = 0; i < results.length; i++) $scope.messages.push(results[i]);
        }).error(function(err) {
            $mdToast.show(
                $mdToast.simple().content(err).position('top right').hideDelay(2000)
            );
        });
    }

    $scope.send = function() {
        $http.post('/api/chat', $scope.newMsg).success(function() {
            $scope.newMsg.text = '';
        }).error(function(err) {
            $mdToast.show(
                $mdToast.simple().content(err).position('top right').hideDelay(2000)
            );
        });
    };

    $scope.formatDate = function(timestamp) {
        var date = new Date(timestamp);
        return ('00' + date.getHours()).slice(-2) + ':'
        + ('00' + date.getMinutes()).slice(-2) + ':'
        + ('00' + date.getSeconds()).slice(-2) + '';
    };
}]);