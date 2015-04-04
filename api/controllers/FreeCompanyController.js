/**
 * FreeCompanyController
 *
 * @description :: Server-side logic for managing free companies (FreeCompany)
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    search: function(req, res) {
        // TODO : search free companies.
        return res.status(501).send();
    },

    list: function(req, res) {
        FreeCompany.native(function(err, Collection) {
            Collection.find({}, {name: 1, tag: 1, isRecruiting: 1, trigram: 1, website: 1, icon: 1, users: 1, _id: 1}).toArray(function(err, result) {
                return res.view('freeCompany/index', {freeCompanies: JSON.stringify(result)});
            });
        });
    },

    show: function(req, res) {
        FreeCompany.findOne({id: req.param("id")}).populate('founders').populate('members').exec(function(err, result) {
            if (err) return res.serverError(err);
            if (!result) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            res.view('freeCompany/show', { freeCompany: JSON.stringify(result) });
        });
    },

    new: function(req, res) {
        // TODO : sends a form to create a free company.
        return res.status(501).send();
    },

    edit: function(req, res) {
        // TODO : sends a form to edit a free company.
        var id = req.param('id');
        return res.status(501).send();
    },

    save: function(req, res) {
        // TODO : saves a free company and return success / error.
        return res.status(501).send();
    },

    remove: function(req, res) {
        // TODO : removes a free company under strict conditions.
        return res.status(501).send();
    },

    _refreshUsers: function(company) {
        // TODO : refresh the list of user ids allowed to manage a free company, based on its founders.
        return;
    }
};

