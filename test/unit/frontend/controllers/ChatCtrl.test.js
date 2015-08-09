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
        ctrl = $controller('ChatCtrl', {$scope: scope});
    }));

    beforeEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    it('should initialize correctly', function() {
        scope.page.title.should.be.eql('chat.titles.page');
    });

    describe('#loadMore()', function() {
        it('should load more messages', function() {
            scope.offset = 15;
            $httpBackend.expectPOST('/api/chat/next', {offset: scope.offset}).respond(200, [{text: 'abc'}, {text: 'def'}]);
            scope.loadMore();
            scope.loading.should.be.true();
            $httpBackend.flush();
            scope.messages.length.should.be.eql(2);
            scope.messages[0].text.should.be.eql('abc');
            scope.offset.should.be.eql(30);
            scope.loading.should.be.false();
        });
    });

    describe('#send()', function() {
        it('should send the message', function() {
            scope.newMsg = {character: 'test', text: 'Test message'};
            $httpBackend.expectPOST('/api/chat', scope.newMsg).respond(200, scope.newMsg);
            scope.send();
            $httpBackend.flush();
            scope.newMsg.text.should.be.eql('');
        });
    });
});
