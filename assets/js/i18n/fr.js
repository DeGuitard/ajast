app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('fr', {
        // Main menu
        'menu.link.fights': 'Combats',
        'menu.link.rolls': 'Dés',
        'menu.link.characters': 'Personnages',
        'menu.link.freeCompanies': 'Compagnies libres',
        'menu.link.login': 'Connexion',
        'menu.link.logout': 'Déconnexion',
        'menu.mainTitle': 'Naviguer',

        // Home page
        'home.perk.characters.title': 'Registre des personnages RP',
        'home.perk.characters.subtitle': 'Qui joue, où, et quoi comme personnage ?',
        'home.perk.freeCompanies.title': 'Registre des compagnies libres RP',
        'home.perk.freeCompanies.subtitle': 'Qui recrute, avec qui je peux jouer ?',
        'home.perk.fights.title': 'Combats avec garantie Fair Play',
        'home.perk.fights.subtitle': "Fini l'enfant de 6 ans qui manie mieux l'épée que le vétéran…",
        'home.login.message': 'Pour avoir accès à toutes les fonctionnalités, connectez-vous !',

        // Fights page
        'fights.titles.page': 'Liste des combats',
        'fights.titles.myFights': 'Mes combats non démarrés',
        'fights.titles.currentFights': 'Combats en cours',
        'fights.titles.oldFights': 'Historique des combats',
        'fights.titles.group': 'Groupe',
        'fights.titles.history': 'Historique',
        'fights.titles.fight': 'Combat #{{shortid}}',
        'fights.buttons.new': 'Nouveau',
        'fights.buttons.start': 'Démarrer',
        'fights.buttons.roll': 'Lancer les dés',
        'fights.buttons.update': 'Mettre à jour',
        'fights.notices.noCurrentFights': "Il n'y a pas de combats en cours.",
        'fights.notices.emptyHistory': "L'historique est vide.",
        'fights.placeholders.addPlayer': 'Ajouter un personnage',
        'fights.actionTypes.offensive': 'Offensif',
        'fights.actionTypes.defensive': 'Défensif',
        'fights.actionTypes.other': 'Autre',
        'fight.form.action.type': "Type d'action",
        'fight.form.action.archetype': 'Archétype exploité',
        'fight.form.action.target': "Cible de l'action",
        'fight.form.action.desc': "Description de l'action",
        'fights.menu.title': 'Mon combat',
        'fights.menu.createNpc': 'Créer un PNJ',
        'fights.menu.cancel': 'Annuler le combat',
        'fights.menu.end': 'Terminer le combat',
        'fights.pnc.form.title': 'Créer un personnage',
        'fights.pnc.form.firstName': 'Prénom',
        'fights.pnc.form.lastName': 'Nom de famille',
        'fights.pnc.form.trigram': 'Trigramme',
        'fights.pnc.form.cancel': 'Annuler',
        'fights.pnc.form.create': 'Valider',

        // Archetypes block
        'archetypes.titles.fight': 'Combat',
        'archetypes.titles.craft': 'Artisanat',
        'archetypes.titles.harvest': 'Récolte',
        'archetypes.notices.overskilled': 'Ce personnage est surcompétent.',
        'archetypes.notices.noCraftSkills': "Ce personnage n'a aucune compétence en artisanat.",
        'archetypes.notices.noHarvestSkills': "Ce personnage n'a aucune compétence en récolte.",
        'archetypes.fightStyle.title': 'Style de combat',
        'archetypes.fightStyle.offensive': 'Offensif',
        'archetypes.fightStyle.defensive': 'Défensif',
        'archetypes.fightStyle.hybrid': 'Hybride',
        'archetypes.fightSkill.lvl1.name': 'Apprenti',
        'archetypes.fightSkill.lvl2.name': 'Amateur',
        'archetypes.fightSkill.lvl3.name': 'Specialiste',
        'archetypes.fightSkill.lvl4.name': 'Expert',
        'archetypes.fightSkill.lvl5.name': 'Surdoué',
        'archetypes.fightSkill.lvl1.desc': 'Connaissances théoriques, peu de pratique.',
        'archetypes.fightSkill.lvl2.desc': 'Connaissances théoriques et entraîné à la pratique.',
        'archetypes.fightSkill.lvl3.desc': 'Très bonnes connaissances et remarquable maîtrise de la pratique.',
        'archetypes.fightSkill.lvl4.desc': "Modèle d'excellence dans le domaine.",
        'archetypes.fightSkill.lvl5.desc': 'Référence dans le monde sur ce domaine.',
        'archetypes.otherSkill.lvl1.name': 'Apprenti',
        'archetypes.otherSkill.lvl2.name': 'Amateur',
        'archetypes.otherSkill.lvl3.name': 'Expert',
        'archetypes.craftSkill.lvl1.desc': 'Capable de réaliser des produits basiques.',
        'archetypes.craftSkill.lvl2.desc': 'Capable de réaliser des produits de qualité intermédiaire.',
        'archetypes.craftSkill.lvl3.desc': "Capable de réaliser des produits d'excellente qualité.",
        'archetypes.harvestSkill.lvl1.desc': 'Capable de récolter des produits de qualité médiocre.',
        'archetypes.harvestSkill.lvl2.desc': 'Capable de récolter un peu de tout.',
        'archetypes.harvestSkill.lvl3.desc': 'Capable de tout récolter.'
    });
}]);