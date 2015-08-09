describe('CharacterCtrl', function() {
    var score, ctrl, $httpBackend;

    beforeEach(module('ajast', function ($translateProvider) {
            $translateProvider.preferredLanguage('en');
    }));

    beforeEach(module(function ($provide) {
        $provide.value('notificationsService', { check: function (){} });
    }));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('MainCtrl', {$scope: scope});
        ctrl = $controller('CharacterCtrl', {$scope: scope});
    }));

    beforeEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    describe('#getAlignment()', function() {
        it('should compute generic alignments', function() {
            // Generic alignments
            scope.getAlignment({ethics: 0, moral: 70}).should.be.eql('Chaotic good');
            scope.getAlignment({ethics: 0, moral: 20}).should.be.eql('Chaotic bad');
            scope.getAlignment({ethics: 0, moral: 40}).should.be.eql('Chaotic neutral');
            scope.getAlignment({ethics: 80, moral: 70}).should.be.eql('Lawful good');
            scope.getAlignment({ethics: 80, moral: 20}).should.be.eql('Lawful bad');
            scope.getAlignment({ethics: 80, moral: 40}).should.be.eql('Lawful neutral');
            scope.getAlignment({ethics: 40, moral: 0}).should.be.eql('Neutral bad');
            scope.getAlignment({ethics: 40, moral: 80}).should.be.eql('Neutral good');
        });

        it('should detect and return special alignments', function() {
            // Special alignments (extreme cases)
            scope.getAlignment({ethics: 0, moral: 0}).should.be.eql('Demoniac');
            scope.getAlignment({ethics: 80, moral: 0}).should.be.eql('Diabolic');
            scope.getAlignment({ethics: 0, moral: 80}).should.be.eql('Beatific');
            scope.getAlignment({ethics: 80, moral: 80}).should.be.eql('Saintly');
            scope.getAlignment({ethics: 40, moral: 40}).should.be.eql('Strictly neutral');
        });

        it('should return the nothing without valid arguments', function() {
            scope.getAlignment({}).should.be.eql('');
        });
    });

    describe('#raceChange()', function() {
        it('should reset character\'s tribe on race change and keep age if it is lower than the new lifespan', function() {
            scope.character = {tribe: 'Test', race: {lifespan: 150}, age: 20};
            scope.raceChange();
            scope.character.should.be.eql({tribe: undefined, race: {lifespan: 150}, age: 20});
        });

        it('should reset character\'s tribe on race change and change age if it is higher than the new lifespan', function() {
            scope.character = {tribe: 'Test', race: {lifespan: 60}, age: 80};
            scope.raceChange();
            scope.character.should.be.eql({tribe: undefined, race: {lifespan: 60}, age: 60});
        });
    });


    describe('#initRaces()', function() {
        var races = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
        it('should load the races and find the character\'s race', function() {
            scope.character = {race: 3};
            scope.initRaces(races);
            scope.character.race.id.should.be.eql(3);
            scope.races.should.be.eql(races);
        });

        it('should load the races and set a default race', function() {
            scope.character = {};
            scope.initRaces(races);
            scope.character.race.id.should.be.eql(1);
            scope.races.should.be.eql(races);
        });
    });

    describe('#getAvatar()', function() {
        it('should return the character\'s avatar when there is one', function() {
            scope.getAvatar({avatar: 'avatar.png'}).should.be.eql('avatar.png');
        });

        it('should return a default avatar when the character doesnt have any', function() {
            scope.getAvatar({avatar: undefined}).should.be.eql('default.png');
        });

        it('should return a default avatar no parameter is given', function() {
            scope.getAvatar().should.be.eql('default.png');
        });
    });

    describe('#getFreeCompanyName()', function() {
        it('should return the free company the character is member of', function() {
            scope.getFreeCompanyName({membership: {name: 'Test'}}).should.be.eql('Test (Member)');
        });

        it('should return the free company the character leads', function() {
            scope.getFreeCompanyName({leadership: {name: 'Test'}}).should.be.eql('Test (Founder)');
        });

        it('should detect when the character does not belong to any free company', function() {
            scope.getFreeCompanyName({}).should.be.eql('None');
        });
    });

    describe('#townTranslated()', function() {
        it('should return the translated town', function () {
            scope.townTranslated({region: 'regions.shroud', name: 'regions.shroud.gridania'}).should.be.eql('Gridania');
        });
    });

    describe('#regionTranslated()', function() {
        it('should return the translated region', function () {
            scope.regionTranslated({region: 'regions.shroud', name: 'regions.shroud.gridania'}).should.be.eql('The Black Shroud');
        });
    });

    describe('#save()', function() {
        it('should save the character', function() {
            var expectation = {character: {timeline: [], race: 123} };
            scope.character = { getTimeline: function() { return []; }, race: {id: 123} };
            $httpBackend.expectPOST('/character/save', expectation).respond(200, [{id:'abc'}]);
            scope.save();
            $httpBackend.flush();
            scope.character.id.should.be.eql('abc');
        });
    });

    describe('#initListMode()', function() {
        it('should display the characters list - logged off mode', function() {
            var characters = [{user: 'abc'}, {user: 'def'}];
            scope.initListMode(characters);
            scope.characters.should.be.eql(characters);
            scope.page.title.should.be.eql('characters.titles.list');
            scope.contextualLinks.should.be.eql({links: [], title: ''});
        });

        it('should display the characters list with links to edit the user\'s own characters', function() {
            var characters = [{user: 'abc', fullName: 'Test 1'}, {user: 'abc', fullName: 'Test 2'}, {user: 'def'}];
            scope.initListMode(characters, 'abc');
            scope.characters.should.be.eql(characters);
            scope.page.title.should.be.eql('characters.titles.list');
            scope.contextualLinks.title.should.be.eql('characters.menu.list.title');
            scope.contextualLinks.links.length.should.be.eql(3);
            scope.contextualLinks.links[0].text.should.be.eql(characters[0].fullName);
            scope.contextualLinks.links[0].state.should.be.eql('characterShow')
            scope.contextualLinks.links[0].stateParams.should.be.eql({name: characters[0].fullName});
            scope.contextualLinks.links[1].text.should.be.eql(characters[1].fullName);
            scope.contextualLinks.links[1].state.should.be.eql('characterShow')
            scope.contextualLinks.links[1].stateParams.should.be.eql({name: characters[1].fullName});
            scope.contextualLinks.links[2].text.should.be.eql('characters.menu.list.new');
            scope.contextualLinks.links[2].state.should.be.eql('characterNew');
        });
    });

    describe('#initShowMode()', function() {
        var character = {fullName: 'Harry Potter', user: 'abc', ethics: 20, moral: 20, id: 123};

        it('should display the character\'s profile, and forbid edit/removal access to logged out users', function() {
            scope.initShowMode(character);
            scope.character.should.be.eql(character);
            scope.page.title.should.be.eql('Harry Potter\'s profile');
            scope.contextualLinks.should.be.eql({links: [], title: ''});
        });

        it('should display the character\'s profile, and restrict edit/removal access to character owner', function() {
            scope.initShowMode(character, 'def');
            scope.character.should.be.eql(character);
            scope.page.title.should.be.eql('Harry Potter\'s profile');
            scope.contextualLinks.should.be.eql({links: [], title: ''});
        });

        it('should display the character\'s profile, and authorize edit/removal access to character owner', function() {
            scope.initShowMode(character, 'abc');
            scope.character.should.be.eql(character);
            scope.page.title.should.be.eql('Harry Potter\'s profile');
            scope.isOwner.should.be.true();
            scope.contextualLinks.title.should.be.eql('characters.menu.show.title');
            scope.contextualLinks.links.length.should.be.eql(2);
            scope.contextualLinks.links[0].text.should.be.eql('characters.menu.show.edit');
            scope.contextualLinks.links[0].state.should.be.eql('characterEdit');
            scope.contextualLinks.links[0].stateParams.should.be.eql({id: 123});
            scope.contextualLinks.links[1].text.should.be.eql('characters.menu.show.delete');
        });

        it('should display the character\'s profile, and authorize edit/removal if there is no character owner', function() {
            character.user = undefined;
            scope.initShowMode(character, 'abc');
            scope.character.should.be.eql(character);
            scope.page.title.should.be.eql('Harry Potter\'s profile');
            scope.isOwner.should.be.true();
            scope.contextualLinks.title.should.be.eql('characters.menu.show.title');
            scope.contextualLinks.links.length.should.be.eql(2);
            scope.contextualLinks.links[0].text.should.be.eql('characters.menu.show.edit');
            scope.contextualLinks.links[0].state.should.be.eql('characterEdit');
            scope.contextualLinks.links[0].stateParams.should.be.eql({id: 123});
            scope.contextualLinks.links[1].text.should.be.eql('characters.menu.show.delete');
        });
    });
});
