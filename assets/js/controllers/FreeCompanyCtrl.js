app.controller('FreeCompanyCtrl', ['$scope', '$timeout', 'charactersService', function($scope, $timeout, charactersService) {
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
            $scope.contextualLinks.title = "Mon compagnie libre";
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
        if (isFounder) $scope.freeCompany.founders.push($scope.newMember);
        else $scope.freeCompany.members.push($scope.newMember);
        $timeout(function() { $scope.searchString = ''; $scope.newMember = undefined; },100);
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
    }
}]);