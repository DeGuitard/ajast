app.controller('FreeCompanyCtrl', ['$scope', '$timeout', '$http', '$mdToast', 'charactersService', function($scope, $timeout, $http, $mdToast, charactersService) {
    $scope.initListMode = function(freeCompanies, userId) {
        $scope.freeCompanies = freeCompanies;
        $scope.contextualLinks.title = 'Mes compagnies';
        $scope.contextualLinks.links = [{
            url: '/free-company/new',
            text: 'Nouvelle compagnie'
        }];

        var ownCompanies = $scope.freeCompanies.filter(function(fc) {
            return fc.users.indexOf(userId) != -1;
        });

        if (ownCompanies.length > 0) {
            for (var i = 0; i < ownCompanies.length; i++) {
                $scope.contextualLinks.links.push({
                    url: "/free-company/show/" + ownCompanies[i]._id,
                    text: ownCompanies[i].name
                });
            }
        }
    };

    $scope.initShowMode = function(freeCompany, userId) {
        $scope.freeCompany = freeCompany;

        if ($scope.freeCompany.users.indexOf(userId) != -1) {
            $scope.contextualLinks.title = 'Ma compagnie';
            $scope.contextualLinks.links = [
                {url: '/free-company/edit/' + $scope.freeCompany.id, text: 'Modifier'},
                {text: 'Supprimer', action: function() { $scope.delete(); }}
            ];
        }
    };

    $scope.initEditMode = function(freeCompany) {
        $scope.freeCompany = freeCompany;
        $scope.icon = '/images/free-companies/' + $scope.freeCompany.icon;

        if ($scope.freeCompany.id) {
            $scope.page.title = "Mettre à jour ma compagnie libre";
            $scope.contextualLinks.title = "Ma compagnie libre";
            $scope.contextualLinks.links = [
                {url: '/free-company/show/' + $scope.freeCompany.id, text: 'Consulter'},
                {text: 'Supprimer', action: function () { $scope.delete(); }}
            ];
        } else {
            $scope.page.title = "Créer sa compagnie libre";
        }
    };

    $scope.findCharacter = function(term) {
        var excludeIds = [], allMembers = $scope.freeCompany.founders.concat($scope.freeCompany.members);
        for (var i = 0; i < allMembers.length; i++) {
            if (allMembers[i].id) excludeIds.push(allMembers[i].id);
        }
        return charactersService.find(term, excludeIds);
    };

    $scope.addMember = function() {
        if (!$scope.newMember || !$scope.newMember.id) return;
        var isFounder = $scope.membersTab.selectedIndex == 0;

        $http.post('/free-company/invite', {member: $scope.newMember.id, freeCompany: $scope.freeCompany.id, isFounder: isFounder})
            .success(function() {
                $scope.newMember.isInvited = true;
                if (isFounder) $scope.freeCompany.founders.push($scope.newMember);
                else $scope.freeCompany.members.push($scope.newMember);
                $scope.searchString = '';
                $scope.newMember = undefined;
            })
            .error(function(err) {
                $mdToast.show(
                    $mdToast.simple().content("Erreur ! " + err).position('top right').hideDelay(5000)
                );
            });
    };

    $scope.removeMember = function(member) {
        var isFounder = $scope.membersTab.selectedIndex == 0;
        if (isFounder) {
            var index = $scope.freeCompany.founders.indexOf(member.id);
            $scope.freeCompany.founders.splice(index, 1);
        } else {
            var index = $scope.freeCompany.members.indexOf(member.id);
            $scope.freeCompany.members.splice(index, 1);
        }
    };

    $scope.save = function() {
        $http.post("/free-company/save", {freeCompany: $scope.freeCompany}).success(function(data) {
            $scope.freeCompany.id = (data.id) ? data.id : data[0].id;
            $mdToast.show(
                $mdToast.simple().content("Sauvegarde réussie !").position('top right').hideDelay(5000)
            );
        }).error(function(err) {
            err = err == 'Conflict' ? 'Nom déjà utilisé par une autre compagnie.' : err;
            $mdToast.show(
                $mdToast.simple().content("Erreur ! " + err).position('top right').hideDelay(5000)
            );
        })
    };
}]);