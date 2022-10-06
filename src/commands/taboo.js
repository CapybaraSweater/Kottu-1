const Command = require('../structures/Command');

module.exports = class Taboo extends Command {
    constructor(kottu) {
        super(kottu);
        this.name = 'taboo',
        this.description = 'All your taboo plugin commands';
        this.options = [
            {
                'type': 1,
                'name': 'stats',
                'description': 'Get your taboo stats',
                'options': [
                    {
                        'type': 6,
                        'name': 'user',
                        'description': 'The user'
                    }
                ]
            },
            {
                'type': 1,
                'name': 'start',
                'description': 'Start a new game of taboo',
                'options': []
            },
            {
                'type': 1,
                'name': 'stop',
                'description': 'Stops an ongoing game!',
                'options': []
            }
        ];
    }
    execute() {
        return Promise.resolve();
    }
    start(interaction) {
        interaction.reply('Creating a new game!');
        return this.kottu.plugins.get('taboo').createGame(interaction.channel, interaction.member);
            
    }
    stop(interaction) {
        return this.kottu.plugins.get('taboo').stopGame(interaction.channel);
    }
};