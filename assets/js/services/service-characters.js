app.factory('charactersService', ['$http', function($http) { return new CharactersService($http); }]);
app.service('charactersService', ['$http', CharactersService]);

function CharactersService($http) {

    this.find = function (term, excludeIds) {
        if (!excludeIds) excludeIds = [];
        return $http.post('/api/character/find/', {term: term}).then(function (response) {
            return response.data.filter(function(item) {
                return excludeIds.indexOf(item.id) == -1;
            });
        });
    };
}