app.controller('FreeCompanyCtrl', ['$scope', function($scope) {
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
        console.log(userId);
        console.log($scope.freeCompany.users[0]);

        if ($scope.freeCompany.users.indexOf(userId) != -1) {
            $scope.contextualLinks.title = 'Ma compagnie';
            $scope.contextualLinks.links = [
                {url: '/free-company/edit/' + $scope.freeCompany.id, text: 'Modifier'},
                {text: 'Supprimer', action: function() { $scope.delete(); }}
            ];
        }
    };

    $scope.initEditMode = function(freeCompany) {
        $scope.character = freeCompany;
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
}]);