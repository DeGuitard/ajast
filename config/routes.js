/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     *  If a request to a URL doesn't match any of the custom routes above, it  *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/
    'get /': 'PageController.index',
    'get /sitemap.xml': 'PageController.siteMap',

    /** Auth routes **/
    'get /login': 'AuthController.login',
    'get /logout': 'AuthController.logout',
    'post /auth/local': 'AuthController.callback',
    'post /auth/local/:action': 'AuthController.callback',
    'get /auth/:provider': 'AuthController.provider',
    'get /auth/:provider/callback': 'AuthController.callback',
    'get /auth/:provider/:action': 'AuthController.callback',

    /** Character routes **/
    'get /character/find/:term': 'CharacterController.search',
    'get /characters': 'CharacterController.list',
    'get /character/new': 'CharacterController.new',
    'get /character/show/:name': 'CharacterController.show',
    'get /character/edit/:id': 'CharacterController.edit',
    'post /character/save': 'CharacterController.save',
    'delete /character/remove/:id': 'CharacterController.remove',
    'post /upload/avatar': 'UploadController.uploadAvatar',

    /** Fights routes **/
    'get /fights': 'FightController.index',
    'get /fight/new': 'FightController.create',
    'get /fight/:id': 'FightController.show',
    'post /fight/roll': 'FightController.roll',
    'post /fight/refresh': 'FightController.refresh',
    'put /fight/save': 'FightController.save',
    'get /fight/end/:id': 'FightController.end',
    'get /api/fight/:id': 'FightController.apiGet',

    /** Rolls routes **/
    'get /rolls': 'RollController.index',
    'get /api/roll': 'RollController.apiList',
    'post /api/roll': 'RollController.apiNew',

    /** Free companies routes **/
    'get /free-company/find/:term': 'FreeCompanyController.search',
    'get /free-companies': 'FreeCompanyController.list',
    'get /free-company/new': 'FreeCompanyController.new',
    'get /free-company/show/:name': 'FreeCompanyController.show',
    'get /free-company/edit/:id': 'FreeCompanyController.edit',
    'post /free-company/save': 'FreeCompanyController.save',
    'post /free-company/invite': 'FreeCompanyController.invite',
    'delete /free-company/remove/:id': 'FreeCompanyController.remove',
    'post /upload/fcicon': 'UploadController.uploadFcIcon',

    /** Notifications routes **/
    'get /notifications': 'NotificationController.list',
    'get /notification/:id/accept': 'NotificationController.accept',
    'get /notification/:id/decline': 'NotificationController.decline',

    /** Internationalisation */
    'get /lang/:lang': 'PageController.lang',

    /** French SEO **/
    'get /personnages': 'CharacterController.list',
    'get /personnage/:name': 'CharacterController.show',
    'get /compagnies-libres': 'FreeCompanyController.list',
    'get /compagnie-libre/:name': 'FreeCompanyController.show',
    'get /combats': 'FightController.index',
    'get /des': 'RollController.index'
};