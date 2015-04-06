app.value('time', { current: { }, actions: { } });
app.factory('timeService', ["time", "$http", function(time) { return new TimeService(time, $http); }]);
app.service('timeService', ["time", "$http", TimeService]);

function TimeService(time, $http) {
    this.init = function(data) {
        time.current = data.time.current;
        time.actions = data.time.actions;
        time.hasStarted = data.time.hasStarted;
        time.isFinished = data.time.isFinished;
        time.id = data.id;
    };

    this.update = function(data) {
        time.current.index = data.time.current.index;
        time.actions = data.time.actions;
    };

    this.id = function() { return time.id; };
    this.isFinished = function() { return time.isFinished };
    this.actions = function() { return time.actions; };
    this.current = function() { return time.current; };
    this.currentAction = function() { return time.actions[time.actions.length - time.current.index]; };
    this.lastAction = function() { return time.actions[time.actions.length - time.current.index + 1]; };

    this.roll = function(callback) {
        $http.post('/fight/roll', {id: time.id, action: this.currentAction()}).success(function(data) {
            time.current.index = data.current.index;
            time.actions = data.actions;
            callback();
        });
    };

    this.canRoll = function() {
        var canRoll = time.current.index <= time.actions.length;
        if (canRoll) canRoll = this.currentAction().type !== undefined;
        if (canRoll) canRoll = this.currentAction().archetype !== undefined;
        if (canRoll) canRoll = this.currentAction().target !== undefined;
        if (canRoll) canRoll = this.currentAction().desc !== undefined;
        if (canRoll) canRoll = !time.isFinished;
        return canRoll;
    };

    this.rollback = function(index) {
        if (!time.actions[index + 1] || time.actions[index + 1].roll) {
            time.current.index = time.actions.length - index;
        }
    };

    this.start = function(callback) {
        time.hasStarted = true;
        this.refreshActions(callback);
    };

    this.refreshActions = function(callback) {
        if (!time.hasStarted) return;
        $http.post('/fight/refresh', {id: time.id}).success(function(data) {
            time.current.index = data.current.index;
            time.actions = data.actions;
            if (callback) callback();
        });
    };

    this.saveActions = function(cb) {
        $http.put('/fight/save', {id: time.id, data: {"time.actions": time.actions}})
            .success(function() {cb(); })
            .error(function(err) { cb(err); });
    }
}