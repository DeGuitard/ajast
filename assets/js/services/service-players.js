app.value('groups', {});
app.value('archetypes', {});

app.factory('playersService', ["$http", "$q", "archetypes", "groups", "timeService", function($http, $q, archetypes, groups, timeService) { return new PlayersService($http, $q, archetypes, timeService); }]);
app.service('playersService', ["$http", "$q", "archetypes", "groups", "timeService", PlayersService]);

function PlayersService($http, $q, archetypes, groups, timeService) {
    this.init = function(groupsData, archetypesData) {
        archetypes.list = archetypesData;
        groups.groupA = groupsData.groupA;
        groups.groupB = groupsData.groupB;
        groups.tmp = groupsData.tmp;
    };

    this.update = function(data) {
        groups.groupA = data.groupA;
        groups.groupB = data.groupB;
    };

    this.groupA = function() { return groups.groupA; };
    this.groupB = function() { return groups.groupB; };
    this.all = function() { return this.groupA().players.concat(this.groupB().players); };
    this.canStart = function() {
        return this.groupA().players.length > 0 && this.groupB().players.length > 0;
    };

    this.addTo = function(newPlayer, group) {
        if (!newPlayer) return;
        newPlayer.active = true;
        newPlayer.group = group.code;
        group.players.push(newPlayer);
        this.save();
    };

    this.find = function(term) {
        var q = $q.defer(), self = this;
        $http.get('/character/find/' + term).success(function(data) {
            // We add the NPCs.
            var tmpPlayers = groups.tmp.filter(function(item) {
                return item.fullName.toUpperCase().indexOf(term.toUpperCase()) != -1;
            });
            var result = data.concat(tmpPlayers);

            // We remove the players that are already in a group.
            result = result.filter(function(item) {
                var all = groups.groupA.players.concat(groups.groupB.players);
                for (var i = 0; i < self.all().length; i++) {
                    if (item.fullName == self.all()[i].fullName) return false;
                }
                return true;
            });

            // We sort the players with their name, and send back the promise.
            result.sort(function(a, b) { return a.fullName > b.fullName ? +1 : -1; });
            q.resolve(result);
        });
        return q.promise;
    };

    this.archetypes = function() { return archetypes.list; };

    this.create = function(player) {
        player.fullName = player.firstName + ' ' + player.lastName;
        groups.tmp.push(player);
        this.save(false);
    };

    this.save = function(withRefresh) {
        withRefresh = withRefresh === undefined ? true : withRefresh;
        $http.put('/fight/save/', {id: timeService.id(), data: {groups: groups}}).success(function() {
            if (withRefresh) timeService.refreshActions();
        });
    }
}