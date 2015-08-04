app.controller('ChatCtrl', ['$scope', '$http', '$mdToast', '$translate', function($scope, $http, $mdToast, $translate) {
    $scope.page.title = 'chat.titles.page';

    io.socket.on('chatmsg', function(event) {
        if (event.verb == 'created') {
            $scope.messages.unshift(event.data);
        }
    });

    io.socket.get('/api/chat/', function(data, jwres) {
        $scope.messages = data;
        $scope.$digest();
    });

    $scope.send = function() {
        $http.post('/api/chat', $scope.newMsg).then(function() {
            $scope.newMsg.text = '';
        }).error(function(err) {
            $mdToast.show(
                $mdToast.simple().content($translate.instant(err)).position('top right').hideDelay(2000)
            );
        });
    };

    $scope.dateToStr = function(timestamp) {
        var date = new Date(timestamp);
        return ('00' + date.getHours()).slice(-2) + ':'
            + ('00' + date.getMinutes()).slice(-2) + ':'
            + ('00' + date.getSeconds()).slice(-2) + ''
            + ' (' + ('00' + date.getDate()).slice(-2) + '/'
            + ('00' + (date.getMonth() + 1)).slice(-2) + ')';
    };
}]);