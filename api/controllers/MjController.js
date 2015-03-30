var MjController = {

    index: function(req, res) {
        // Native request to limit the fields... because Sails can't handle projection...
        Archetype.native(function(err, Collection) {
            Collection.find({}, {desc: 0, _id: 0}).toArray(function(err, result) {
                res.view({
                    archetypes : JSON.stringify(result)
                });
            });
        });
    }
};

module.exports = MjController;