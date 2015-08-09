app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/home',
            controller: genericController
        })
        .state('login', {
            url: '/login',
            templateUrl: '/partials/login',
            controller: genericController
        })
        .state('characters', {
            url: '/characters',
            templateUrl: '/partials/characters',
            controller: 'CharacterCtrl'
        })
        .state('characterShow', {
            url: '/character/:name',
            controller: 'CharacterCtrl',
            templateUrl: function ($stateParams){
                return '/partials/character/show/' + $stateParams.name;
            }
        })
        .state('characterEdit', {
            url: '/character/edit/:id',
            controller: 'CharacterCtrl',
            templateUrl: function ($stateParams){
                return '/partials/character/edit/' + $stateParams.id;
            }
        })
        .state('characterNew', {
            url: '/character/new',
            controller: 'CharacterCtrl',
            templateUrl: '/partials/character/new/',
        })
        .state('fights', {
            url: '/fights',
            controller: genericController,
            templateUrl: '/partials/fights'
        })
        .state('fightShow', {
            url: '/fight/:id',
            controller: genericController,
            templateUrl: function ($stateParams){
                return '/partials/fight/show/' + $stateParams.id;
            }
        })
        .state('fightNew', {
            url: '/fight/new',
            controller: genericController,
            templateUrl: '/partials/fight/new',
        })
        .state('roll', {
            url: '/roll',
            controller: 'RollCtrl',
            templateUrl: '/partials/rolls',
        })
        .state('chat', {
            url: '/chat',
            templateUrl: '/partials/chat',
            controller: 'ChatCtrl'
        })
        .state('freeCompanies', {
            url: '/free-companies',
            templateUrl: '/partials/free-companies',
            controller: 'FreeCompanyCtrl'
        })
        .state('freeCompanyShow', {
            url: '/free-company/:name',
            controller: 'FreeCompanyCtrl',
            templateUrl: function ($stateParams){
                return '/partials/free-company/show/' + $stateParams.name;
            }
        })
        .state('freeCompanyEdit', {
            url: '/free-company/edit/:id',
            controller: 'FreeCompanyCtrl',
            templateUrl: function ($stateParams){
                return '/partials/free-company/edit/' + $stateParams.id;
            }
        })
        .state('freeCompanyNew', {
            url: '/free-company/new',
            controller: 'FreeCompanyCtrl',
            templateUrl: '/partials/free-company/new/',
        })

    // French SEO
    $urlRouterProvider.when('/personnages', '/characters');
    $urlRouterProvider.when('/personnage/:name', '/character/:name');
    $urlRouterProvider.when('/compagnies-libres', '/free-companies');
    $urlRouterProvider.when('/compagnie-libre/:name', '/free-company/:name');
    $urlRouterProvider.when('/combats', '/fights');
    $urlRouterProvider.when('/des', '/roll');

});

app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
});

var genericController = function($scope) {
    $scope.contextualLinks.links = [];
    $scope.contextualLinks.title = '';
    $scope.page.title = '';
};