app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('fr', {
        // Main menu
        'menu.link.fights': 'Combats',
        'menu.link.rolls': 'Dés',
        'menu.link.characters': 'Personnages',
        'menu.link.freeCompanies': 'Compagnies libres',
        'menu.link.chat': 'Discuter',
        'menu.link.login': 'Connexion',
        'menu.link.logout': 'Déconnexion',
        'menu.mainTitle': 'Naviguer',

        // Home page
        'home.perk.characters.title': 'Liste des personnages RP',
        'home.perk.characters.subtitle': 'Qui joue, où, et quoi comme personnage ?',
        'home.perk.freeCompanies.title': 'Liste des compagnies libres RP',
        'home.perk.freeCompanies.subtitle': 'Qui recrute, avec qui je peux jouer ?',
        'home.perk.fights.title': 'Combats avec garantie Fair Play',
        'home.perk.fights.subtitle': "Fini l'enfant de 6 ans qui manie mieux l'épée que le vétéran…",
        'home.login.message': 'Pour avoir accès à toutes les fonctionnalités, connectez-vous !',
        'home.switch.en': 'Switch to the English version',
        'home.switch.fr': 'Passer à la version française',

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
        'archetypes.harvestSkill.lvl3.desc': 'Capable de tout récolter.',

        // Timeline block
        'timeline.buttons.showHistory': 'Afficher l\'histoire d\'Eorzea',
        'timeline.buttons.hideHistory': 'Masquer l\'histoire d\'Eorzea',
        'timeline.notices.update': 'Nouveau nom : ',
        'timeline.notices.new': 'Nom de l\'événement : ',
        'timeline.groups.personal': 'Histoire personnelle',
        'timeline.groups.eorzea': 'Histoire eorzéenne',
        'timeline.events.1': 'Guerre de l\'Automne',
        'timeline.events.2': 'Invention de la barde pour Chocobo',
        'timeline.events.3': 'Ququruka invoque Barbatos, puis le scelle avec lui',
        'timeline.events.4': 'Naissance de Solus zos Galvus',
        'timeline.events.5': 'Première cartographie d\'Eorzea par Roddard Ironheart',
        'timeline.events.6': 'Fondation de l\'empire de Garlemald sous Solus zos Galvus',
        'timeline.events.7': 'Toto-Rak est scellée par Oracle',
        'timeline.events.8': 'Theodoric, roi d\'Ala Mhigo, fait interdire le culte de Rhalgr',
        'timeline.events.9': 'Massacres et torture des disciples de Rhalgr',
        'timeline.events.10': 'Invasion d\'Ala Mhigo',
        'timeline.events.11': 'Combat entre Sir Alberic et Nidhogg',
        'timeline.events.12': 'La flotte de Garlemald est détruite par le Gardien du Lac',
        'timeline.events.13': 'Ifrit est invoqué',
        'timeline.events.14': 'Alliance entre Limsa Lominsa et les pirates',
        'timeline.events.15': 'Nael van Darnus est vaincue',
        'timeline.events.16': 'Bataille de Carteneau, et libération Bahamut',

        // Characters pages
        'characters.titles.list': 'Liste des personnages',
        'characters.titles.show': 'Profil de {{name}}',
        'characters.titles.update': 'Mettre à jour mon personnage',
        'characters.titles.new': 'Créer un personnage',
        'characters.titles.search': 'Rechercher',
        'characters.titles.namePhysique': 'Nom et physique',
        'characters.titles.behaviour': 'Culture et comportement',
        'characters.titles.timeline': 'Chronologie',
        'characters.titles.desc': 'Descriptions supplémentaires',
        'characters.titles.avatar': 'Apparence en jeu',
        'characters.titles.playerInfo': 'Informations sur le joueur',
        'characters.search.byName': 'Rechercher par nom',
        'characters.search.byServer': 'Rechercher par serveur',
        'characters.menu.list.title': 'Mes personnages',
        'characters.menu.list.new': 'Créer un nouveau personnage',
        'characters.menu.update.title': 'Mon personnage',
        'characters.menu.update.show': 'Consulter',
        'characters.menu.update.delete': 'Supprimer',
        'characters.menu.show.title': 'Mon personnage',
        'characters.menu.show.edit': 'Modifier',
        'characters.menu.show.delete': 'Supprimer',
        'characters.labels.firstName': 'Prénom',
        'characters.labels.lastName': 'Nom de famille',
        'characters.labels.trigram': 'Trigramme',
        'characters.labels.race': 'Race',
        'characters.labels.tribe': 'Ethnie',
        'characters.labels.sex': 'Sexe',
        'characters.labels.sex.man': 'Homme',
        'characters.labels.sex.woman': 'Femme',
        'characters.labels.age': 'Âge',
        'characters.labels.age.child': 'Enfant',
        'characters.labels.age.young': 'Jeune',
        'characters.labels.age.adult': 'Adulte',
        'characters.labels.age.mature': 'Mature',
        'characters.labels.age.aging': 'Vieillissant',
        'characters.labels.age.old': 'Vieux',
        'characters.labels.freeCompany': 'Compagnie libre',
        'characters.labels.founder': 'Foundateur',
        'characters.labels.member': 'Membre',
        'characters.labels.none': 'Aucune',
        'characters.labels.god': 'Divinité vénérée',
        'characters.labels.birthPlace': 'Lieu de naissance',
        'characters.labels.align': 'Alignement',
        'characters.labels.align.chaotic': 'Chaotique',
        'characters.labels.align.lawful': 'Loyal',
        'characters.labels.align.good': 'Bon',
        'characters.labels.align.bad': 'Mauvais',
        'characters.labels.align.chaotic.desc': 'N\'obéit qu\'à ses propres règles et ne suit aucun ordre.',
        'characters.labels.align.lawful.desc': 'Respecte toutes les règles et la hiérarchie.',
        'characters.labels.align.good.desc': 'Privilégie le bien collectif, altruiste.',
        'characters.labels.align.bad.desc': 'Place sa propre personne au dessus de tout le reste.',
        'characters.labels.align.neutral': 'Neutre',
        'characters.labels.align.saintly': 'Saint',
        'characters.labels.align.beatific': 'Béatifique',
        'characters.labels.align.demoniac': 'Demoniaque',
        'characters.labels.align.diabolic': 'Diabolique',
        'characters.labels.align.neutralStrict': 'Neutre Strict',
        'characters.labels.physDesc': 'Description physique',
        'characters.labels.mentDesc': 'Description psychologique',
        'characters.labels.server': 'Serveur',
        'characters.labels.language': 'Langue parlée',
        'characters.labels.languages.fr': 'Français',
        'characters.labels.languages.en': 'Anglais',
        'characters.labels.chooseFace': 'Choisir un visage',
        'characters.buttons.save': 'Sauvegarder',
        'characters.buttons.edit': 'Modifier',
        'characters.notices.fileTooBig': 'Le fichier est trop volumineux (1mo max).',
        'characters.notices.saveSuccess': 'Sauvegarde réussie !',
        'characters.notices.saveError': 'Erreur !',
        'characters.notices.conflictError': 'Ce trigramme ou nom est déjà utilisé par un autre personnage.',
        'characters.notices.deleteTitle': 'Êtes-vous sûr de vouloir supprimer ce personnage ?',
        'characters.notices.deleteMsg': 'La suppression de personnage est irréversible.',
        'characters.notices.corruptData': 'Données corrompues.',

        // Free companies pages
        'fc.titles.list': 'Liste des compagnies libres',
        'fc.titles.show': 'Profil de {{name}}',
        'fc.titles.create': 'Créer ma compagnie libre',
        'fc.titles.edit': 'Mettre à jour ma compagnie libre',
        'fc.titles.search': 'Rechercher',
        'fc.titles.generalInfo': 'Informations générales',
        'fc.titles.presentation': 'Présentation',
        'fc.titles.icon': 'Icône',
        'fc.titles.founders': 'Fondateurs',
        'fc.titles.members': 'Membres',
        'fc.menu.list.title': 'Mes compagnies libres',
        'fc.menu.title': 'Ma compagnie libre',
        'fc.menu.show': 'Consulter',
        'fc.menu.edit': 'Modifier',
        'fc.menu.new': 'Créer ma compagnie libre',
        'fc.menu.delete': 'Supprimer',
        'fc.notices.pendingInv': 'Invitation en attente',
        'fc.notices.fileTooBig': 'Le fichier est trop volumineux (512ko max).',
        'fc.notices.saveSuccess': 'Sauvegarde réussie !',
        'fc.notices.conflict': 'Ce nom est déjà utilisé par un autre compagnie libre.',
        'fc.notices.error': 'Erreur ! ',
        'fc.notices.deleteTitle': 'Êtes-vous sûr de vouloir supprimer cette compagnie libre ?',
        'fc.notices.deleteMsg': 'La suppression de compagnie libre est irréversible.',
        'fc.notices.noResults': 'Aucune compagnie libre trouvée.',
        'fc.notices.saveOnce': 'Merci de sauvegarder la CL une première fois avant d\'inviter des membres.',
        'fc.notices.corruptData': 'Données corrompues.',
        'fc.notices.alreadyInvited': 'Ce personnage a déjà une invitation en cours.',
        'fc.notices.alreadyInside': 'Ce personnage est déjà dans une compagnie libre.',
        'fc.labels.search.server': 'Rechercher par serveur',
        'fc.labels.search.name': 'Rechercher par nom',
        'fc.labels.name': 'Nom',
        'fc.labels.tag': 'Tag',
        'fc.labels.server': 'Serveur',
        'fc.labels.website': 'Site / Forum',
        'fc.labels.recruitment': 'Recrutement',
        'fc.labels.recruitment.open': 'Recrutement ouvert',
        'fc.labels.recruitment.close': 'Recrutement fermé',
        'fc.labels.house.no': 'N°',
        'fc.labels.house.ward': 'Secteur',
        'fc.labels.house.district': 'Quartier',
        'fc.labels.addCharacter': 'Ajouter un personnage',
        'fc.buttons.icon': 'Changer l\'icône',
        'fc.buttons.save': 'Sauvegarder',

        // Notifications block
        'notif.fc.invite': '{{charName}} a été invité(e) dans {{fcName}}',
        'notif.accept': 'Accepter',
        'notif.deny': 'Refuser',

        // Rolls page
        'rolls.titles.page': 'Lancer de dés',
        'rolls.titles.new': 'Lancer un dé',
        'rolls.titles.history': 'Derniers résultats',
        'rolls.notices.roll': 'Un dé vient d\'être lancé !',
        'rolls.roll.desc': 'Description de l\'action',
        'rolls.buttons.roll': 'Lancer',

        // Chats page
        'chat.titles.page': 'Chat',
        'chat.titles.main': 'Discuter',
        'chat.labels.character': 'Pseudonyme',
        'chat.labels.text': 'Texte',
        'chat.labels.anonymous': 'Anonyme',
        'chat.labels.admin': 'Administrateur',
        'chat.buttons.send': 'Envoyer',
        'chat.buttons.loadMore': 'Voir plus',

        // Log in page
        'login.titles.login': 'Connexion',
        'login.labels.with': 'Avec',
        'login.notices.privacy': 'Votre pseudonyme, adresse email et noms ne seront jamais affichés, quelque soit le compte que vous choisissez.',

        // Error pages
        'errors.403': '« Un Roegadyn bien bâti vous fait signe de faire demi-tour. »',
        'errors.404': '« Alors que vous demandez où est la page, un passant vous explique qu\'un Goobbue l\'a mangée. Hm. »',
        'errors.500.row1': '« Vous remarquez que quelque chose ne tourne pas rond. Il doit y avoir une erreur… Peut-être une perturbation éthérique ! »',
        'errors.500.row2': 'Les meilleurs techniciens de Sharlayan sont sur le coup.',

        // Forms
        'forms.invalid.required': 'Champ requis.',
        'forms.invalid.maxlength': 'Trop long !',
        'forms.invalid.minlength': 'Trop court !',
        'forms.invalid.pattern': 'Format invalide !',
        'forms.invalid.threeChars': 'Doit contenir 3 caractères !',
        'forms.buttons.confirm': 'Confirmer',
        'forms.buttons.cancel': 'Annuler',

        // Races and tribes
        'races.tribes.elezen1': 'Sylvestre',
        'races.tribes.elezen2': 'Crépusculaire',
        'races.tribes.hyur1': 'Hyurois',
        'races.tribes.hyur2': 'Hyurgoth',
        'races.tribes.lalafell1': 'Peuple des Plaines',
        'races.tribes.lalafell2': 'Peuple des Dunes',
        'races.tribes.miqote1': 'Tribu du Soleil',
        'races.tribes.miqote2': 'Tribu de la Lune',
        'races.tribes.roegadyn1': 'Clan de la Mer',
        'races.tribes.roegadyn2': 'Clan du Feu',
        'races.tribes.aura1': 'Raen',
        'races.tribes.aura2': 'Xaela',

        // Gods
        'gods.althyk.desc': 'le Contemplateur',
        'gods.azeyma.desc': 'la Gardienne',
        'gods.byregot.desc': 'l\'Artisan',
        'gods.halone.desc': 'la Conquérante',
        'gods.llymlaen.desc': 'la Navigatrice',
        'gods.menphina.desc': 'la Bien-Aimante',
        'gods.naldthal.desc': 'les Marchands',
        'gods.nophica.desc': 'la Mère',
        'gods.nymeia.desc': 'la Fileuse',
        'gods.oschon.desc': 'le Vagabond',
        'gods.rhalgr.desc': 'le Destructeur',
        'gods.thaliak.desc': 'l\'Érudit',
        'gods.none.desc': 'ou autre que les Douze',
        'gods.none': 'Aucun',

        // Jobs
        'jobs.ast': 'Astromancien',
        'jobs.blm': 'Mage Noir',
        'jobs.brd': 'Barde',
        'jobs.drg': 'Chevalier Dragon',
        'jobs.drk': 'Chevalier Noir',
        'jobs.mcn': 'Machiniste',
        'jobs.mnk': 'Moine',
        'jobs.nin': 'Ninja',
        'jobs.pld': 'Paladin',
        'jobs.npc': 'PNJ',
        'jobs.sch': 'Érudit',
        'jobs.smn': 'Invocateur',
        'jobs.war': 'Guerrier',
        'jobs.whm': 'Mage Blanc',

        // Regions
        'regions.shroud': 'La Forêt de Sombrelinceul',
        'regions.shroud.gridania': 'Gridania',
        'regions.shroud.tranquil': 'Camp des Sentes tranquilles',
        'regions.shroud.hawthorne': 'Hutte des Hawthorne',
        'regions.shroud.bentbranch': 'Ranch de Brancharquée',
        'regions.shroud.quarrymill': 'Moulin de la carrière',
        'regions.shroud.fallgourd': 'Radeau de la Calebasse',
        'regions.shroud.hyrstmill': 'Moulin des Bois',
        'regions.shroud.other': 'Quelque part dans la Forêt de Sombrelinceul',
        'regions.noscea': 'La Noscea',
        'regions.noscea.limsa': 'Limsa Lominsa',
        'regions.noscea.aleport': 'Port-aux-Ales',
        'regions.noscea.bronze': 'Camp du Lac d\'Airain',
        'regions.noscea.costa': 'Costa del Sol',
        'regions.noscea.moraby': 'Chantier naval de Moraby',
        'regions.noscea.overlook': 'Camp du Guet',
        'regions.noscea.summerford': 'Vergers d\'Estival',
        'regions.noscea.swiftperch': 'Le Martinet',
        'regions.noscea.wineport': 'Port-aux-Vins',
        'regions.noscea.other': 'Quelque part dans la Noscea',
        'regions.thanalan': 'Le Thanalan',
        'regions.thanalan.uldah': 'Ul\'dah',
        'regions.thanalan.blackbrush': 'Gare de Roncenoire',
        'regions.thanalan.bluefog': 'Camp de Brumebleue',
        'regions.thanalan.drybone': 'Camp des Os désséchés',
        'regions.thanalan.ceruleum': 'Usine de céruléum',
        'regions.thanalan.springs': 'Oasis oubliée',
        'regions.thanalan.horizon': 'Horizon',
        'regions.thanalan.little': 'Petite Ala Mhigo',
        'regions.thanalan.other': 'Quelque part dans le Thanalan',
        'regions.coerthas': 'Coerthas',
        'regions.coerthas.ishgard': 'Ishgard',
        'regions.coerthas.dragonhead': 'Camp de la Tête du Dragon',
        'regions.coerthas.observatorium': 'Observatoire',
        'regions.coerthas.whitebrim': 'Poste de l\'Arête Blanche',
        'regions.coerthas.other': 'Quelque part dans le Coerthas',
        'regions.mordhona': 'Mor Dhona',
        'regions.mordhona.toll': 'Glas des revenants',
        'regions.mordhona.saint': 'Trouvaille de Saint Coinach',
        'regions.mordhona.other': 'Quelque part dans le Mor Dhona',
        'regions.others': 'Autres',
        'regions.others.abalathia': 'Quelque part dans Abalathia',
        'regions.others.dravania': 'Quelque part dans Dravania',
        'regions.others.gyrabania': 'Quelque part dans Gyr Abania',
        'regions.others.ilsabard': 'Quelque part dans Ilsabard',
        'regions.others.paglthan': 'Quelque part dans Paglth\'an',
        'regions.others.sharlayan': 'Quelque part dans Sharlayan',
        'regions.others.xelphatol': 'Quelque part dans Xelphatol',
        'regions.others.other': 'Quelque part',
        'regions.othard': 'Othard',
        'regions.othard.doma': 'Doma',
        'regions.othard.other': 'Quelque part dans Othard'
    });
}]);