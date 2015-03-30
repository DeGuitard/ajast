var app = angular.module('ajast', ['ngAnimate', 'ngMaterial', 'ngMessages', 'flow']).config(["$mdThemingProvider", function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('blue')
        .warnPalette('red');
    $mdThemingProvider.theme('dark')
        .primaryPalette('grey').dark();
    $mdThemingProvider.theme('fight')
        .primaryPalette('blue', { 'hue-2': '700' })
        .accentPalette('indigo', { 'hue-2': '700' })
}]);