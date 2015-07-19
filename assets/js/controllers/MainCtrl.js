app.controller('MainCtrl', ['$scope', '$mdSidenav', 'notificationsService', function($scope, $mdSidenav, notificationsService) {
    $scope.links = [
        {url: '/combats', text: 'Combats'},
        {url: '/des', text: 'Dés'},
        {url: '/personnages', text: 'Personnages'},
        {url: '/compagnies-libres', text: 'Compagnies libres'}
    ];
    $scope.contextualLinks = {};
    $scope.openMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').open(); };
    $scope.closeMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').close(); };
    $scope.page = {};
    $scope.to = function(url) { window.location.href = url; };

    notificationsService.check();
}]);