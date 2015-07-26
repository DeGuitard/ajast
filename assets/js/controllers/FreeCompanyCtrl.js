app.controller('FreeCompanyCtrl', ['$scope', '$timeout', '$http', '$mdToast', '$mdDialog', 'charactersService', '$translate', '$interpolate', function($scope, $timeout, $http, $mdToast, $mdDialog, charactersService, $translate, $interpolate) {
    $scope.initListMode = function(freeCompanies, servers, userId) {
        $scope.freeCompanies = freeCompanies;
        $scope.servers = servers;
        $scope.search = {};
        $scope.page.title = 'fc.titles.list';
        $scope.contextualLinks.title = 'fc.menu.list.title';
        $scope.contextualLinks.links = [];

        if (userId) {
            var ownCompanies = $scope.freeCompanies.filter(function (fc) {
                return fc.users.indexOf(userId) != -1;
            });

            if (ownCompanies.length > 0) {
                for (var i = 0; i < ownCompanies.length; i++) {
                    $scope.contextualLinks.links.push({
                        url: "/compagnie-libre/" + ownCompanies[i].name,
                        text: ownCompanies[i].name
                    });
                }
            }
        }

        $scope.contextualLinks.links.push({
            url: '/free-company/new',
            text: 'fc.menu.new'
        });
    };

    $scope.initShowMode = function(freeCompany, userId) {
        $scope.freeCompany = freeCompany;
        $translate('fc.titles.show', {name: freeCompany.name}).then(function (title) { $scope.page.title = title; });

        if ($scope.freeCompany.users.indexOf(userId) != -1 || $scope.freeCompany.users.length == 0) {
            $scope.contextualLinks.title = 'fc.menu.title';
            $scope.contextualLinks.links = [
                {url: '/free-company/edit/' + $scope.freeCompany.id, text: 'fc.menu.edit'},
                {text: 'fc.menu.delete', action: function() { $scope.delete(); }}
            ];
        }
    };

    $scope.initEditMode = function(freeCompany) {
        $scope.freeCompany = freeCompany;
        $scope.icon = '/images/free-companies/' + $scope.freeCompany.icon;

        if ($scope.freeCompany.id) {
            $scope.page.title = 'fc.titles.edit';
            $scope.contextualLinks.title = 'fc.menu.title';
            $scope.contextualLinks.links = [
                {url: '/compagnie-libre/' + $scope.freeCompany.name, text: 'fc.menu.show'},
                {text: 'fc.menu.delete', action: function () { $scope.delete(); }}
            ];
        } else {
            $scope.page.title = 'fc.titles.create';
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
                var error = $interpolate('{{err | translate}}')({err: err});
                $mdToast.show(
                    $mdToast.simple().content($scope.noticesMsg.error + error).position('top right').hideDelay(5000)
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
                $mdToast.simple().content($scope.noticesMsg.saveSuccess).position('top right').hideDelay(5000)
            );
        }).error(function(err) {
            var error = $interpolate('{{err | translate}}')({err: err});
            $mdToast.show(
                $mdToast.simple().content($scope.noticesMsg.error + error).position('top right').hideDelay(5000)
            );
        })
    };

    $scope.delete = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title($scope.noticesMsg.deleteTitle)
            .content($scope.noticesMsg.deleteMsg)
            .ok($scope.noticesMsg.confirm)
            .cancel($scope.noticesMsg.cancel)
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $http.delete('/free-company/remove/' + $scope.freeCompany.id).success(function() {
                window.location.href = '/free-companies';
            }).error(function(err) {
                var error = $interpolate('{{err | translate}}')({err: err});
                $mdToast.show(
                    $mdToast.simple().content($scope.noticesMsg.error + error).position('top right').hideDelay(5000)
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
            $scope.uploadError = 'fc.notices.fileTooBig';
            event.preventDefault();
        }
        $scope.imageLoading = true;
        $scope.imageIndex = $scope.imageIndex === undefined ? 0 : $scope.imageIndex + 1;
    });

    // Translations
    $scope.noticesMsg = {};
    $translate('fc.notices.saveSuccess').then(function (val) { $scope.noticesMsg.saveSuccess = val; });
    $translate('fc.notices.error').then(function (val) { $scope.noticesMsg.error = val; });
    $translate('fc.notices.deleteTitle').then(function (val) { $scope.noticesMsg.deleteTitle = val; });
    $translate('fc.notices.deleteMsg').then(function (val) { $scope.noticesMsg.deleteMsg = val; });
    $translate('forms.buttons.confirm').then(function (val) { $scope.noticesMsg.confirm = val; });
    $translate('forms.buttons.cancel').then(function (val) { $scope.noticesMsg.cancel = val; });
}]);