app.controller('MainCtrl', ['$scope', '$mdSidenav', '$state', 'notificationsService', function($scope, $mdSidenav, $state, notificationsService) {
    $scope.links = [
        {state: 'fights', text: 'menu.link.fights'},
        {state: 'roll', text: 'menu.link.rolls'},
        {state: 'characters', text: 'menu.link.characters'},
        {state: 'freeCompanies', text: 'menu.link.freeCompanies'},
        {state: 'chat', text: 'menu.link.chat'},
    ];
    $scope.contextualLinks = {};
    $scope.openMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').open(); };
    $scope.closeMenu = function() { if (!$scope.noMenu) $mdSidenav('menu').close(); };
    $scope.page = {};

    $scope.to = function(state, stateParams) {
        $state.go(state, stateParams, {reload: true});
    };
    $scope.url = function(url) { window.location.href = url; };

    notificationsService.check();
}]);