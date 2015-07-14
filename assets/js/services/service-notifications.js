app.factory('notificationsService', ['$http', '$mdToast', function($http, $mdToast) { return new NotificationsService($http, $mdToast); }]);
app.service('notificationsService', ['$http', '$mdToast', NotificationsService]);

function NotificationsService($http, $mdToast) {
    var self = this;

    this.check = function() {
        $http.get('/notifications/').success(function(list) {
            if (list.length > 0) {
                self.display(list[0]);
            }
        });
    };

    this.display = function(notification) {
        $mdToast.show({
            controller: 'NotificationCtrl',
            templateUrl: '/js/templates/ng-template-notification.html',
            hideDelay: 0,
            position: 'top right',
            locals: {notification: notification}
        });
    };

    this.accept = function(notification) {
        $http.get('/notification/' + notification.id + '/accept').error(function(err) {
            $mdToast.show($mdToast.simple().content('Erreur !' + err).position('top right'));
        })
        .success(function() {
            self.check();
        });
    };
    this.decline= function(notification) {
        $http.get('/notification/' + notification.id + '/decline').error(function(err) {
            $mdToast.show($mdToast.simple().content('Erreur !' + err).position('top right'));
        })
        .success(function() {
            self.check();
        });
    };
}