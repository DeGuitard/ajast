/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');

module.exports = {

    index: function(req, res) {
        res.view({
            title: 'La plateforme RP de référence pour Final Fantasy XIV',
            metaDesc: "Retrouvez tout l'essentiel pour faire Role Play sur FFXIV : les compagnies libres, les personnages, un système de combat et plein d'outils pratiques !"
        });
    }
};

