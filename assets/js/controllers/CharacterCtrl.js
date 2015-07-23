app.controller('CharacterCtrl', ['$scope', '$http', '$mdToast', '$mdDialog', function($scope, $http, $mdToast, $mdDialog) {
    $scope.initRaces = function(races) {
        $scope.races = races;
        for (var i = 0; i < $scope.races.length; i++) {
            if ($scope.races[i].id == $scope.character.race) {
                $scope.character.race = $scope.races[i];
                break;
            }
        }
        if (!$scope.character.race) $scope.character.race = $scope.races[0];
        else console.log($scope.character.race);
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
                    url: '/personnage/' + userCharacters[i].fullName,
                    text: userCharacters[i].fullName
                });
            }
            $scope.contextualLinks.links.push({url: '/character/new', text: 'characters.menu.list.new'});
        }
    };

    $scope.initShowMode = function(character, userId) {
        $translate('characters.titles.show', {name: character.fullName}).then(function (title) { $scope.page.title = title; });
        $scope.character = character;
        if (userId && ($scope.character.user == userId || $scope.character.user == undefined)) {
            $scope.isOwner = true;
            $scope.contextualLinks.title = 'characters.menu.show.title';
            $scope.contextualLinks.links = [
                {url: '/character/edit/' + $scope.character.id, text: 'characters.menu.show.edit'},
                {text: 'characters.menu.show.delete', action: function() { $scope.delete(); }}
            ];
        }
    };

    $scope.initEditMode = function(character) {
        $scope.character = character;
        $scope.avatar = '/images/avatars/' + $scope.character.avatar;
        if ($scope.character.id) {
            $scope.page.title = 'characters.titles.update';
            $scope.contextualLinks.title = 'characters.menu.update.title';
            $scope.contextualLinks.links = [
                {url: '/personnage/' + $scope.character.fullName, text: 'characters.menu.update.show'},
                {text: 'characters.menu.update.delete', action: function () { $scope.delete(); }}
            ];
        } else {
            $scope.page.title = 'characters.titles.new';
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
            $scope.uploadError = 'Fichier trop volumineux (1mo max).';
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
                $mdToast.simple().content('Sauvegarde réussie !').position('top right').hideDelay(5000)
            );
        }).error(function(err) {
            err = err == 'Conflict' ? 'Nom ou trigramme déjà utilisé par un autre personnage.' : err;
            $mdToast.show(
                $mdToast.simple().content('Erreur ! ' + err).position('top right').hideDelay(5000)
            );
        })
    };

    $scope.delete = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Voulez-vous vraiment supprimer ce personnage ?')
            .content('La suppression d\'un personnage est irréversible.')
            .ok('Confirmer')
            .cancel('Annuler')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $http.delete('/character/remove/' + $scope.character.id).success(function() {
                window.location.href = '/characters';
            }).error(function(err) {
                $mdToast.show(
                    $mdToast.simple().content("Erreur ! " + err).position('top right').hideDelay(5000)
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
        if (character.avatar) return character.avatar;
        else return 'default.png';
    };

    $scope.getAlignment = function(character) {
        // Specific alignments (extreme cases).
        if (character.moral == 0 && character.ethics == 0) return 'Démoniaque';
        if (character.moral == 80 && character.ethics == 0) return 'Béatifique';
        if (character.moral == 0 && character.ethics == 80) return 'Diabolique';
        if (character.moral == 80 && character.ethics == 80) return 'Saint';
        if (character.moral == 40 && character.ethics == 40) return 'Neutre strict';

        // Generic alignments.
        var alignment = '';
        if (character.ethics < 40) alignment = 'Chaotique ';
        if (character.ethics > 40) alignment = 'Loyal ';
        if (character.ethics == 40) alignment = 'Neutre ';
        if (character.moral < 40) alignment += 'mauvais';
        if (character.moral > 40) alignment += 'bon';
        if (character.moral == 40) alignment += 'neutre';

        return alignment;
    };

    $scope.getFreeCompanyName = function(character) {
        if (character.membership) return character.membership.name + ' (membre)';
        if (character.leadership) return character.leadership.name + ' (fondateur)';
        return 'Aucune'
    }
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