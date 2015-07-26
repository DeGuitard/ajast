app.controller('MainCtrl', ['$scope', '$mdSidenav', 'notificationsService', function($scope, $mdSidenav, notificationsService) {
    $scope.links = [
        {url: '/combats', text: 'menu.link.fights'},
        {url: '/des', text: 'menu.link.rolls'},
        {url: '/personnages', text: 'menu.link.characters'},
        {url: '/compagnies-libres', text: 'menu.link.freeCompanies'}
    ];
    $scope.contextualLinks = {};
    $scope.openMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').open(); };
    $scope.closeMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').close(); };
    $scope.page = {};
    $scope.to = function(url) { window.location.href = url; };

    notificationsService.check();
}]);