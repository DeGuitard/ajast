app.controller('CharacterCtrl', ['$scope', '$http', '$mdToast', '$mdDialog', '$translate', '$interpolate', '$filter', function($scope, $http, $mdToast, $mdDialog, $translate, $interpolate, $filter) {
    $scope.initRaces = function(races) {
        $scope.races = races;
        for (var i = 0; i < $scope.races.length; i++) {
            if ($scope.races[i].id == $scope.character.race) {
                $scope.character.race = $scope.races[i];
                break;
            }
        }
        if (!$scope.character.race) $scope.character.race = $scope.races[0];
    };

    $scope.initListMode = function(characters, userId) {
        $scope.page.title = 'characters.titles.list';
        $scope.characters = characters;
        var userCharacters = [];

        if (userId) {
            for (var i = 0; i < characters.length; i++) {
                if (userId == characters[i].user) {
                    userCharacters.push(characters[i]);
                }
            }

            $scope.contextualLinks.title = 'characters.menu.list.title';
            $scope.contextualLinks.links = [];
            for (var i = 0; i < userCharacters.length; i++) {
                $scope.contextualLinks.links.push({
                    state: 'characterShow',
                    stateParams: {name: userCharacters[i].fullName},
                    text: userCharacters[i].fullName
                });
            }
            $scope.contextualLinks.links.push({state: 'characterNew', text: 'characters.menu.list.new'});
        } else {
            $scope.contextualLinks.title = '';
            $scope.contextualLinks.links = [];
        }
    };

    $scope.initShowMode = function(character, userId) {
        $scope.page.title = $translate.instant('characters.titles.show', {name: character.fullName});
        $scope.character = character;
        if (userId && ($scope.character.user == userId || $scope.character.user == undefined)) {
            $scope.isOwner = true;
            $scope.contextualLinks.title = 'characters.menu.show.title';
            $scope.contextualLinks.links = [
                {state: 'characterEdit', stateParams: {id: $scope.character.id}, text: 'characters.menu.show.edit'},
                {text: 'characters.menu.show.delete', action: function() { $scope.delete(); }}
            ];
        } else {
            $scope.contextualLinks.title = '';
            $scope.contextualLinks.links = [];
        }
    };

    $scope.initEditMode = function(character) {
        $scope.character = character;
        $scope.avatar = '/images/avatars/' + $scope.character.avatar;
        if ($scope.character.id) {
            $scope.page.title = 'characters.titles.update';
            $scope.contextualLinks.title = 'characters.menu.update.title';
            $scope.contextualLinks.links = [
                {state: 'characterShow', stateParams: {name: $scope.character.fullName}, text: 'characters.menu.update.show'},
                {text: 'characters.menu.update.delete', action: function () { $scope.delete(); }}
            ];
        } else {
            $scope.page.title = 'characters.titles.new';
            $scope.contextualLinks.title = '';
            $scope.contextualLinks.links = [];
            $scope.avatar = '/images/avatars/default.png';
        }
    };

    // Listen to upload events ; on complete we must gather the filename of the uploaded image.
    // We also give the possibility to the user to come back to its first avatar, so the original
    // avatar filename is saved.
    $scope.$on('flow::fileSuccess', function (arg0, arg1, arg2, arg3) {
        if ($scope.character.oldAvatar === undefined) {
            $scope.character.oldAvatar = $scope.character.avatar;
        }
        $scope.character.avatar = JSON.parse(arg3).flowFilename;
    });
    $scope.$on('flow::fileAdded', function (event, flow, file) {
        if (file.size > 1024000) {
            $scope.uploadError = $translate.instant('characters.notices.fileTooBig');
            event.preventDefault();
        } else {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file.file);
            fileReader.onload = function (event) {
                $scope.avatar = event.target.result;
                $scope.uploadError = null;
            };
        }
    });

    $scope.save = function() {
        var charToSave = {};
        for (var key in $scope.character) {
            charToSave[key] = $scope.character[key];
        }
        charToSave.timeline = $scope.character.getTimeline();
        charToSave.race = $scope.character.race.id;
        $http.post('/character/save', {character: charToSave}).success(function(data) {
            $scope.character.id = (data.id) ? data.id : data[0].id;
            $mdToast.show(
                $mdToast.simple().content($translate.instant('characters.notices.saveSuccess')).position('top right').hideDelay(5000)
            );
        }).error(function(err) {
            var error = $interpolate('{{err | translate}}')({err: err});
            $mdToast.show(
                $mdToast.simple().content($translate.instant('characters.notices.saveError') + ' ' + error).position('top right').hideDelay(5000)
            );
        })
    };

    $scope.delete = function(ev) {
        var confirm = $mdDialog.confirm()
            .title($translate.instant('characters.notices.deleteTitle'))
            .content($translate.instant('characters.notices.deleteMsg'))
            .ok($translate.instant('forms.buttons.confirm'))
            .cancel($translate.instant('forms.buttons.cancel'))
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
            $http.delete('/character/remove/' + $scope.character.id).success(function() {
                $scope.to('characters');
            }).error(function(err) {
                var error = $interpolate('{{err | translate}}')({err: err}),
                    msg   = $translate.instant('characters.notices.saveError') + ' ' + error;
                $mdToast.show(
                    $mdToast.simple().content(msg).position('top right').hideDelay(5000)
                );
            });
        });
    };

    $scope.raceChange = function() {
        if ($scope.character.race.lifespan < $scope.character.age) {
            $scope.character.age = $scope.character.race.lifespan;
        }
        $scope.character.tribe = undefined;
    };

    $scope.getAvatar = function(character) {
        if (character && character.avatar) return character.avatar;
        else return 'default.png';
    };

    $scope.getAlignment = function(character) {
        // Specific alignments (extreme cases).
        if      (character.moral == 0  && character.ethics == 0)  return $translate.instant('characters.labels.align.demoniac');
        else if (character.moral == 80 && character.ethics == 0)  return $translate.instant('characters.labels.align.beatific');
        else if (character.moral == 0  && character.ethics == 80) return $translate.instant('characters.labels.align.diabolic');
        else if (character.moral == 80 && character.ethics == 80) return $translate.instant('characters.labels.align.saintly');
        else if (character.moral == 40 && character.ethics == 40) return $translate.instant('characters.labels.align.neutralStrict');

        // Generic alignments.
        var alignment = '';
        if      (character.ethics < 40)  alignment = $translate.instant('characters.labels.align.chaotic');
        else if (character.ethics > 40)  alignment = $translate.instant('characters.labels.align.lawful');
        else if (character.ethics == 40) alignment = $translate.instant('characters.labels.align.neutral');
        if      (character.moral < 40)   alignment += ' ' + $translate.instant('characters.labels.align.bad').toLowerCase();
        else if (character.moral > 40)   alignment += ' ' + $translate.instant('characters.labels.align.good').toLowerCase();
        else if (character.moral == 40)  alignment += ' ' + $translate.instant('characters.labels.align.neutral').toLowerCase();

        return alignment;
    };

    $scope.getFreeCompanyName = function(character) {
        if (character.membership) return character.membership.name + ' (' + $translate.instant('characters.labels.member') + ')';
        if (character.leadership) return character.leadership.name + ' (' + $translate.instant('characters.labels.founder') + ')';
        return $translate.instant('characters.labels.none');
    };

    $scope.townTranslated = function(val) { return $translate.instant(val.name); };
    $scope.regionTranslated = function(val) { return $translate.instant(val.region); };
}]);

// Just a small directive to be able to update the avatar with the preview of the new image.
app.directive('avatar', function(){
    return function(scope, element, attrs) {
        scope.$watch(attrs.avatar, function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});