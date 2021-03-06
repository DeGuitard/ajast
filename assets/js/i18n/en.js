app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        // Main menu
        'menu.link.fights': 'Fights',
        'menu.link.rolls': 'Rolls',
        'menu.link.characters': 'Characters',
        'menu.link.freeCompanies': 'Free companies',
        'menu.link.chat': 'Talk',
        'menu.link.login': 'Log in',
        'menu.link.logout': 'Log out',
        'menu.mainTitle': 'Browse',

        // Home page
        'home.perk.characters.title': 'RP Characters list',
        'home.perk.characters.subtitle': 'Who plays, where, and which kind of character?',
        'home.perk.freeCompanies.title': 'RP Free companies list',
        'home.perk.freeCompanies.subtitle': 'Who recruits, with whom can I play?',
        'home.perk.fights.title': 'Fair play fights',
        'home.perk.fights.subtitle': "No more 6 years-old handling swords better than a veteran…",
        'home.login.message': 'For a full access to features, log in!',
        'home.switch.en': 'Switch to the English version',
        'home.switch.fr': 'Passer à la version française',

        // Fights page
        'fights.titles.page': 'Fights list',
        'fights.titles.myFights': 'My incoming fights',
        'fights.titles.currentFights': 'Current fights',
        'fights.titles.oldFights': 'Finished fights',
        'fights.titles.group': 'Group',
        'fights.titles.history': 'History',
        'fights.titles.fight': 'Fight #{{shortid}}',
        'fights.buttons.new': 'New',
        'fights.buttons.start': 'Start',
        'fights.buttons.roll': 'Roll dices',
        'fights.buttons.update': 'Update',
        'fights.notices.noCurrentFights': 'There are no fights at the moment.',
        'fights.notices.emptyHistory': 'The history is empty.',
        'fights.notices.error': 'Error!',
        'fights.placeholders.addPlayer': 'Add a character',
        'fights.actionTypes.offensive': 'Offensive',
        'fights.actionTypes.defensive': 'Defensive',
        'fights.actionTypes.other': 'Other',
        'fight.form.action.type': 'Action type',
        'fight.form.action.archetype': 'Archetype to use',
        'fight.form.action.target': "Action's target",
        'fight.form.action.desc': "Action's description",
        'fights.menu.title': 'My fight',
        'fights.menu.createNpc': 'Create NPC',
        'fights.menu.cancel': 'Cancel fight',
        'fights.menu.end': 'End fight',
        'fights.pnc.form.title': 'Create a character',
        'fights.pnc.form.firstName': 'First name',
        'fights.pnc.form.lastName': 'Last name',
        'fights.pnc.form.trigram': 'Trigram',
        'fights.pnc.form.cancel': 'Cancel',
        'fights.pnc.form.create': 'Create',

        // Archetypes block
        'archetypes.titles.fight': 'War and magic',
        'archetypes.titles.craft': 'Hand',
        'archetypes.titles.harvest': 'Land',
        'archetypes.notices.overskilled': 'This character is overpowered.',
        'archetypes.notices.noCraftSkills': "This character hasn't any crafting skills.",
        'archetypes.notices.noHarvestSkills': "This character hasn't any harvesting skills.",
        'archetypes.fightStyle.title': 'Fight style',
        'archetypes.fightStyle.offensive': 'Offensive',
        'archetypes.fightStyle.defensive': 'Defensive',
        'archetypes.fightStyle.hybrid': 'Hybrid',
        'archetypes.fightSkill.lvl1.name': 'Apprentice',
        'archetypes.fightSkill.lvl2.name': 'Amateur',
        'archetypes.fightSkill.lvl3.name': 'Specialist',
        'archetypes.fightSkill.lvl4.name': 'Expert',
        'archetypes.fightSkill.lvl5.name': 'Gifted',
        'archetypes.fightSkill.lvl1.desc': 'Theorical knowledge, lack practice.',
        'archetypes.fightSkill.lvl2.desc': 'Theorical knowledge and trained to practice.',
        'archetypes.fightSkill.lvl3.desc': 'Very good knowledge and remarkable mastery of the discipline.',
        'archetypes.fightSkill.lvl4.desc': 'Model of excellence in the discipline.',
        'archetypes.fightSkill.lvl5.desc': 'Reference in the world on the subject.',
        'archetypes.otherSkill.lvl1.name': 'Apprentice',
        'archetypes.otherSkill.lvl2.name': 'Amateur',
        'archetypes.otherSkill.lvl3.name': 'Expert',
        'archetypes.craftSkill.lvl1.desc': 'Able to produce basic products.',
        'archetypes.craftSkill.lvl2.desc': 'Able to produce intermediate products.',
        'archetypes.craftSkill.lvl3.desc': 'Able to produce excellent products.',
        'archetypes.harvestSkill.lvl1.desc': 'Able to harvest basic products.',
        'archetypes.harvestSkill.lvl2.desc': 'Able to harvest most of things.',
        'archetypes.harvestSkill.lvl3.desc': 'Able to harvest everything.',

        // Timeline block
        'timeline.buttons.showHistory': 'Show Eorzean History',
        'timeline.buttons.hideHistory': 'Hide Eorzean History',
        'timeline.notices.update': 'New name: ',
        'timeline.notices.new': 'Name of the event: ',
        'timeline.groups.personal': 'Personal History',
        'timeline.groups.eorzea': 'Eorzean History',
        'timeline.events.1': 'Autumn War',
        'timeline.events.2': 'Invention of the Chocobo barding',
        'timeline.events.3': 'Ququruka summons Barbatos, and then seals the demon with him',
        'timeline.events.4': 'Solus zos Galvus birth',
        'timeline.events.5': 'First Eorzean cartography by Roddard Ironheart',
        'timeline.events.6': 'Foundation of the Garlemald Empire by Solus zos Galvus',
        'timeline.events.7': 'Toto-Rak is sealed by the Oracle',
        'timeline.events.8': 'Theodoric, Ala Mhigo\'s king, forbids the Rhalgr cult',
        'timeline.events.9': 'Killings and torture of Rhalgr disciples',
        'timeline.events.10': 'Ala Mhigo is invaded',
        'timeline.events.11': 'Fight between Sir Alberic and Nidhogg',
        'timeline.events.12': 'Garlemald fleet is destroyed by the Lake Keeper',
        'timeline.events.13': 'Ifrit is summoned',
        'timeline.events.14': 'Alliance between Limsa Lominsa and the pirates',
        'timeline.events.15': 'Nael van Darnus is vanquished',
        'timeline.events.16': 'Carteneau battle, and release of Bahamut',

        // Characters pages
        'characters.titles.list': 'Characters list',
        'characters.titles.show': '{{name}}\'s profile',
        'characters.titles.update': 'Update my character',
        'characters.titles.new': 'Create a character',
        'characters.titles.search': 'Search',
        'characters.titles.namePhysique': 'Name and physique',
        'characters.titles.behaviour': 'Culture and behaviour',
        'characters.titles.timeline': 'Timeline',
        'characters.titles.desc': 'Additionnal descriptions',
        'characters.titles.avatar': 'In-game appearance',
        'characters.titles.playerInfo': 'Player information',
        'characters.search.byName': 'Search by name',
        'characters.search.byServer': 'Search by server',
        'characters.menu.list.title': 'My characters',
        'characters.menu.list.new': 'Create a new character',
        'characters.menu.update.title': 'My character',
        'characters.menu.update.show': 'Show profile',
        'characters.menu.update.delete': 'Delete',
        'characters.menu.show.title': 'My character',
        'characters.menu.show.edit': 'Edit',
        'characters.menu.show.delete': 'Delete',
        'characters.labels.firstName': 'First name',
        'characters.labels.lastName': 'Last name',
        'characters.labels.trigram': 'Trigram',
        'characters.labels.race': 'Race',
        'characters.labels.tribe': 'Tribe',
        'characters.labels.sex': 'Sex',
        'characters.labels.sex.man': 'Man',
        'characters.labels.sex.woman': 'Woman',
        'characters.labels.years': 'years old',
        'characters.labels.age': 'Age',
        'characters.labels.age.child': 'Child',
        'characters.labels.age.young': 'Young',
        'characters.labels.age.adult': 'Adult',
        'characters.labels.age.mature': 'Mature',
        'characters.labels.age.aging': 'Aging',
        'characters.labels.age.old': 'Old',
        'characters.labels.freeCompany': 'Free Company',
        'characters.labels.founder': 'Founder',
        'characters.labels.member': 'Member',
        'characters.labels.none': 'None',
        'characters.labels.god': 'Worshipped God',
        'characters.labels.birthPlace': 'Birth place',
        'characters.labels.align': 'Alignment',
        'characters.labels.align.chaotic': 'Chaotic',
        'characters.labels.align.lawful': 'Lawful',
        'characters.labels.align.good': 'Good',
        'characters.labels.align.bad': 'Bad',
        'characters.labels.align.chaotic.desc': 'Follows only his own rules, and won\'t listen any order.',
        'characters.labels.align.lawful.desc': 'Follows all the rules, and obey to the hierarchy.',
        'characters.labels.align.good.desc': 'Favour other\'s good, is altruistic.',
        'characters.labels.align.bad.desc': 'Considers himself more important than anything.',
        'characters.labels.align.neutral': 'Neutral',
        'characters.labels.align.saintly': 'Saintly',
        'characters.labels.align.beatific': 'Beatific',
        'characters.labels.align.demoniac': 'Demoniac',
        'characters.labels.align.diabolic': 'Diabolic',
        'characters.labels.align.neutralStrict': 'Strictly neutral',
        'characters.labels.physDesc': 'Physical description',
        'characters.labels.mentDesc': 'Psychological description',
        'characters.labels.chooseFace': 'Choose a face',
        'characters.labels.server': 'Server',
        'characters.labels.language': 'Language used',
        'characters.labels.languages.fr': 'French',
        'characters.labels.languages.en': 'English',
        'characters.buttons.save': 'Save',
        'characters.buttons.edit': 'Edit',
        'characters.notices.fileTooBig': 'File is too big (1mb max).',
        'characters.notices.saveSuccess': 'Save success!',
        'characters.notices.saveError': 'Error!',
        'characters.notices.conflictError': 'Trigram or name is already used by another character.',
        'characters.notices.deleteTitle': 'Are you sure you want to delete this character?',
        'characters.notices.deleteMsg': 'Character removal is irreversible.',
        'characters.notices.corruptData': 'Corrupt data.',

        // Free companies pages
        'fc.titles.list': 'Free companies list',
        'fc.titles.show': '{{name}}\'s profile',
        'fc.titles.create': 'Create my free company',
        'fc.titles.edit': 'Edit my free company',
        'fc.titles.search': 'Search',
        'fc.titles.generalInfo': 'General information',
        'fc.titles.presentation': 'Presentation',
        'fc.titles.icon': 'Icon',
        'fc.titles.founders': 'Founders',
        'fc.titles.members': 'Members',
        'fc.menu.list.title': 'My free companies',
        'fc.menu.title': 'My free company',
        'fc.menu.show': 'Show',
        'fc.menu.edit': 'Edit',
        'fc.menu.new': 'Create a new free company',
        'fc.menu.delete': 'Delete',
        'fc.notices.pendingInv': 'Invitation pending',
        'fc.notices.fileTooBig': 'File is too big (512ko max).',
        'fc.notices.saveSuccess': 'Save success!',
        'fc.notices.conflict': 'Name already used by another free company.',
        'fc.notices.error': 'Error! ',
        'fc.notices.deleteTitle': 'Are you sure you want to delete this free company?',
        'fc.notices.deleteMsg': 'Free company removal is irreversible.',
        'fc.notices.noResults': 'No results found.',
        'fc.notices.saveOnce': 'Please save the free company at least once before inviting members.',
        'fc.notices.corruptData': 'Corrupt data.',
        'fc.notices.alreadyInvited': 'This character is already invited (maybe somewhere else?).',
        'fc.notices.alreadyInside': 'This character is already inside a free company.',
        'fc.labels.search.server': 'Search by server',
        'fc.labels.search.name': 'Search by name',
        'fc.labels.name': 'Name',
        'fc.labels.tag': 'Tag',
        'fc.labels.server': 'Server',
        'fc.labels.website': 'Website / Forum',
        'fc.labels.recruitment': 'Recruitment',
        'fc.labels.recruitment.open': 'Recruiting',
        'fc.labels.recruitment.close': 'Not recruiting',
        'fc.labels.house.no': 'No.',
        'fc.labels.house.ward': 'Ward',
        'fc.labels.house.district': 'District',
        'fc.labels.addCharacter': 'Add a character',
        'fc.labels.player': 'Player',
        'fc.buttons.icon': 'Change icon',
        'fc.buttons.save': 'Save',

        // Notifications block
        'notif.fc.invite': '{{charName}} has been invited to {{fcName}}',
        'notif.accept': 'Accept',
        'notif.deny': 'Deny',

        // Rolls page
        'rolls.titles.page': 'Dice rolls',
        'rolls.titles.new': 'Roll a dice',
        'rolls.titles.history': 'Last rolls',
        'rolls.notices.roll': 'A dice just has been rolled!',
        'rolls.roll.desc': 'Action\'s description',
        'rolls.buttons.roll': 'Roll',

        // Chats page
        'chat.titles.page': 'Chat',
        'chat.titles.main': 'Talk',
        'chat.labels.character': 'Pseudonym',
        'chat.labels.text': 'Text',
        'chat.labels.anonymous': 'Anonymous',
        'chat.labels.admin': 'Administrator',
        'chat.buttons.send': 'Send',
        'chat.buttons.loadMore': 'Show more',

        // Log in page
        'login.titles.login': 'Log in',
        'login.labels.with': 'With',
        'login.notices.privacy': 'Your username, email and name will never be displayed, whatever the account type you choose.',

        // Error pages
        'errors.403': '“A well built Roeadyn strongly advices you to turn around.”',
        'errors.404': '“When you\'re about to ask yourself where the page has gone, a passerby explains to you that a Goobbue ate it. Hm.”',
        'errors.500.row1': '“You notice something\'s wrong. There must be a mistake somewhere… maybe an etheric perturbation!”',
        'errors.500.row2': '“The best Sharlayan technicians are on the case.”',

        // Forms
        'forms.invalid.required': 'Required field.',
        'forms.invalid.maxlength': 'Too long!',
        'forms.invalid.minlength': 'Too short!',
        'forms.invalid.pattern': 'Invalid format!',
        'forms.invalid.threeChars': 'Must contain 3 characters!',
        'forms.buttons.confirm': 'Confirm',
        'forms.buttons.cancel': 'Cancel',

        // Races and tribes
        'races.tribes.elezen1': 'Wildwood',
        'races.tribes.elezen2': 'Duskwight',
        'races.tribes.hyur1': 'Midlanders',
        'races.tribes.hyur2': 'Highlanders',
        'races.tribes.lalafell1': 'Plainsfolk',
        'races.tribes.lalafell2': 'Dunesfolk',
        'races.tribes.miqote1': 'Seekers of the Sun',
        'races.tribes.miqote2': 'Keepers of the Moon',
        'races.tribes.roegadyn1': 'Sea Wolves',
        'races.tribes.roegadyn2': 'Hellsguard',
        'races.tribes.aura1': 'Raen',
        'races.tribes.aura2': 'Xaela',

        // Gods
        'gods.althyk.desc': 'the Keeper',
        'gods.azeyma.desc': 'the Warden',
        'gods.byregot.desc': 'the Builder',
        'gods.halone.desc': 'the Fury',
        'gods.llymlaen.desc': 'the Navigator',
        'gods.menphina.desc': 'the Lover',
        'gods.naldthal.desc': 'the Traders',
        'gods.nophica.desc': 'the Matron',
        'gods.nymeia.desc': 'the Spinner',
        'gods.oschon.desc': 'the Wanderer',
        'gods.rhalgr.desc': 'the Destroyer',
        'gods.thaliak.desc': 'the Scholar',
        'gods.none.desc': 'or other than the Twelve',
        'gods.none': 'None',

        // Jobs
        'jobs.ast': 'Astromancer',
        'jobs.blm': 'Black Mage',
        'jobs.brd': 'Bard',
        'jobs.drg': 'Dragoon Knight',
        'jobs.drk': 'Dark Knight',
        'jobs.mcn': 'Machinist',
        'jobs.mnk': 'Monk',
        'jobs.nin': 'Ninja',
        'jobs.pld': 'Paladin',
        'jobs.npc': 'NPC',
        'jobs.sch': 'Scholar',
        'jobs.smn': 'Summoner',
        'jobs.war': 'Warrior',
        'jobs.whm': 'White Mage',

        // Regions
        'regions.shroud': 'The Black Shroud',
        'regions.shroud.gridania': 'Gridania',
        'regions.shroud.tranquil': 'Camp Tranquil',
        'regions.shroud.hawthorne': 'The Hawthrone Hut',
        'regions.shroud.bentbranch': 'Bentbranch Meadows',
        'regions.shroud.quarrymill': 'Quarrymill',
        'regions.shroud.fallgourd': 'Fallgourd Float',
        'regions.shroud.hyrstmill': 'Hyrstmill',
        'regions.shroud.other': 'Somewhere in the Black Shroud',
        'regions.noscea': 'La Noscea',
        'regions.noscea.limsa': 'Limsa Lominsa',
        'regions.noscea.aleport': 'Aleport',
        'regions.noscea.bronze': 'Camp Bronze Lake',
        'regions.noscea.costa': 'Costa del Sol',
        'regions.noscea.moraby': 'Moraby Drydocks',
        'regions.noscea.overlook': 'Camp Overlook',
        'regions.noscea.summerford': 'Summerford Farms',
        'regions.noscea.swiftperch': 'Swiftperch',
        'regions.noscea.wineport': 'Wineport',
        'regions.noscea.other': 'Somewhere in the Noscea',
        'regions.thanalan': 'Thanalan',
        'regions.thanalan.uldah': 'Ul\'dah',
        'regions.thanalan.blackbrush': 'Black Brush Station',
        'regions.thanalan.bluefog': 'Camp Bluefog',
        'regions.thanalan.drybone': 'Camp Drybone',
        'regions.thanalan.ceruleum': 'Ceruleum Processing',
        'regions.thanalan.springs': 'Forgotten Springs',
        'regions.thanalan.horizon': 'Horizon',
        'regions.thanalan.little': 'Little Ala Mhigo',
        'regions.thanalan.other': 'Somewhere in the Thanalan',
        'regions.coerthas': 'Coerthas',
        'regions.coerthas.ishgard': 'Ishgard',
        'regions.coerthas.dragonhead': 'Camp Dragonhead',
        'regions.coerthas.observatorium': 'Observatorium',
        'regions.coerthas.whitebrim': 'Whitebrim Front',
        'regions.coerthas.other': 'Somewhere in the Coerthas',
        'regions.mordhona': 'Mor Dhona',
        'regions.mordhona.toll': 'Revenant\'s Toll',
        'regions.mordhona.saint': 'Saint Coinach\'s Find',
        'regions.mordhona.other': 'Somewhere in the Mor Dhona',
        'regions.others': 'Others',
        'regions.others.abalathia': 'Somewhere in Abalathia',
        'regions.others.dravania': 'Somewhere in Dravania',
        'regions.others.gyrabania': 'Somewhere in Gyr Abania',
        'regions.others.ilsabard': 'Somewhere in Ilsabard',
        'regions.others.paglthan': 'Somewhere in Paglth\'an',
        'regions.others.sharlayan': 'Somewhere in Sharlayan',
        'regions.others.xelphatol': 'Somewhere in Xelphatol',
        'regions.others.other': 'Somewhere',
        'regions.othard': 'Othard',
        'regions.othard.doma': 'Doma',
        'regions.othard.other': 'Somewhere in Othard'
    });
}]);