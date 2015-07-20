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
            title: 'Communauté RP de Final Fantasy XIV',
            metaDesc: "Retrouvez tout l'essentiel pour faire du Role Play sur FFXIV : les compagnies libres, les personnages, un système de combat et plein d'outils pratiques !"
        });
    },

    siteMap: function(req, res) {
        var map = '<?xml version="1.0" encoding="UTF-8"?>';
        map += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        map += '<url><loc>http://xivrp.com/</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>';
        map += '<url><loc>http://xivrp.com/compagnies-libres</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';
        map += '<url><loc>http://xivrp.com/personnages</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';
        map += '<url><loc>http://xivrp.com/combats</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>';
        map += '<url><loc>http://xivrp.com/des</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>';
        map += '<url><loc>http://xivrp.com/login</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>';

        async.parallel({
            freeCompanies: function(callback) {
                FreeCompany.find().exec(callback);
            },
            characters: function(callback) {
                Character.find().exec(callback);
            }
        }, function(err, data) {
            if (err) return res.serverError(res);

            for (var i = 0; i < data.freeCompanies.length; i++) {
                map += '<url><loc>http://xivrp.com/compagnie-libre/' + data.freeCompanies[i].name + '</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';
            }

            for (var i = 0; i < data.characters.length; i++) {
                map += '<url><loc>http://xivrp.com/personnage/' + data.characters[i].fullName + '</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>';
            }

            map += '</urlset>';
            res.set('Content-Type', 'text/xml');
            return res.send(map);
        });
    }
};