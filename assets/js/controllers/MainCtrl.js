app.controller('MainCtrl', ["$scope", "$mdSidenav", "$mdMedia", function($scope, $mdSidenav, $mdMedia) {
    $scope.links = [
        {url: '/fights', text: 'Combats'},
        {url: '/rolls', text: 'Dés'},
        {url: '/characters', text: 'Personnages'}
    ];
    $scope.contextualLinks = {};
    $scope.openMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').open(); };
    $scope.closeMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').close(); };
    $scope.page = {};
    $scope.to = function(url) { window.location.href = url; }
}]);