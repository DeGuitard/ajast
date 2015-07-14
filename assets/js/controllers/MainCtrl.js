app.controller('MainCtrl', ['$scope', '$mdSidenav', 'notificationsService', function($scope, $mdSidenav, notificationsService) {
    $scope.links = [
        {url: '/fights', text: 'Combats'},
        {url: '/rolls', text: 'Dés'},
        {url: '/characters', text: 'Personnages'},
        {url: '/free-companies', text: 'Compagnies libres'}
    ];
    $scope.contextualLinks = {};
    $scope.openMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').open(); };
    $scope.closeMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').close(); };
    $scope.page = {};
    $scope.to = function(url) { window.location.href = url; };

    notificationsService.check();
}]);