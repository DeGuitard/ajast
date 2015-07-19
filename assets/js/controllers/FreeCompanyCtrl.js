app.controller('FreeCompanyCtrl', ['$scope', '$timeout', '$http', '$mdToast', '$mdDialog', 'charactersService', function($scope, $timeout, $http, $mdToast, $mdDialog, charactersService) {
    $scope.initListMode = function(freeCompanies, servers, userId) {
        $scope.freeCompanies = freeCompanies;
        $scope.servers = servers;
        $scope.search = {};
        $scope.contextualLinks.title = 'Mes compagnies';
        $scope.contextualLinks.links = [];

        if (userId) {
            var ownCompanies = $scope.freeCompanies.filter(function (fc) {
                return fc.users.indexOf(userId) != -1;
            });

            if (ownCompanies.length > 0) {
                for (var i = 0; i < ownCompanies.length; i++) {
                    $scope.contextualLinks.links.push({
                        url: "/free-company/show/" + ownCompanies[i].id,
                        text: ownCompanies[i].name
                    });
                }
            }
        }

        $scope.contextualLinks.links.push({
            url: '/free-company/new',
            text: 'Créer une nouvelle'
        });
    };

    $scope.initShowMode = function(freeCompany, userId) {
        $scope.freeCompany = freeCompany;

        if ($scope.freeCompany.users.indexOf(userId) != -1 || $scope.freeCompany.users.length == 0) {
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
        var isFounder = $scope.membersTab.selectedIndex == 0,
            list = isFounder ? $scope.freeCompany.founders : $scope.freeCompany.members,
            index = list.indexOf(member);
        if (index != -1) list.splice(index, 1);
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

    $scope.delete = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Voulez-vous vraiment supprimer cette compagnie libre ?')
            .content('La suppression d\'une compagnie libre est irréversible.')
            .ok('Confirmer')
            .cancel('Annuler')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $http.delete('/free-company/remove/' + $scope.freeCompany.id).success(function() {
                window.location.href = '/free-companies';
            }).error(function(err) {
                $mdToast.show(
                    $mdToast.simple().content("Erreur ! " + err).position('top right').hideDelay(5000)
                );
            });
        });
    };

    $scope.$on('flow::fileSuccess', function (arg0, arg1, arg2, arg3) {
        $scope.freeCompany.icon = JSON.parse(arg3).flowFilename;
        $scope.newImage = true;
        $scope.imageLoading = false;
    });
    $scope.$on('flow::fileAdded', function (event, flow, file) {
        if (file.size > 512000) {
            $scope.uploadError = 'Fichier trop volumineux (512ko max).';
            event.preventDefault();
        }
        $scope.imageLoading = true;
        $scope.imageIndex = $scope.imageIndex === undefined ? 0 : $scope.imageIndex + 1;
        console.log($scope.imageIndex);
    });
}]);