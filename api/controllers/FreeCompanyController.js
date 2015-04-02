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
        // TODO : list and render all the companies.
        return res.status(501).send();
    },

    show: function(req, res) {
        // TODO : show one free company.
        var id = req.param('id');
        return res.status(501).send();
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

