app.controller('NotificationCtrl', ['$scope', '$mdToast', 'notificationsService', 'notification', function($scope, $mdToast, notificationsService, notification) {
    $scope.accept   = function() { notificationsService.accept(notification);   $mdToast.hide(); };
    $scope.decline  = function() { notificationsService.decline(notification);  $mdToast.hide(); };

    $scope.notification = notification;
    $scope.translateData = {
        charName: notification.data.character.fullName,
        fcName: notification.data.freeCompany.name
    };
}]);