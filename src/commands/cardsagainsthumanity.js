const Command = require('../structures/Command');

module.exports = class CAH extends Command {
    constructor(k) {
        super(k);
        this.name = 'cardsagainsthumanity';
        this.description = 'All your commands related to Cards Against Humanity';
        this.options = [
            {
                'type': 1,
                'name': 'info',
                'description': 'Get your C.A.H stats',
                'options': []
            },
            {
                'type': 1,
                'name': 'start',
                'description': 'Start a game of C.A.H',
                'options': [{
                    type: 5,
                    name: 'explicit',
                    description: 'WHether explicit content is allowed',
                    required: true
                }]
            },
        ];
    }
    execute() {
        return Promise.resolve();
    }
    start(int) {
        int.reply('Creating a game');
        return this.kottu.plugins.get('Cards against humanity').start(int.channel, int.options.getBoolean('explicit'));
    }

};