app.factory('charactersService', ['$http', function($http) { return new CharactersService($http); }]);
app.service('charactersService', ['$http', CharactersService]);

function CharactersService($http) {

    this.find = function (term, excludeIds) {
        if (!excludeIds) excludeIds = [];
        return $http.get('/character/find/' + term).then(function (response) {
            return response.data.filter(function(item) {
                item.id = item._id;
                return excludeIds.indexOf(item.id) == -1;
            });
        });
    };
}