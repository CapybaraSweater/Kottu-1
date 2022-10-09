const Command = require('../structures/Command');

module.exports = class CAH extends Command {
    constructor(k) {
        super(k);
        this.name = 'cah';
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
                'options': []
            },
        ];
    }
    execute() {
        return Promise.resolve();
    }
    async start(int) {
        await this.reply(int, { content: 'Creating game...', ephemeral: true });
        return this.kottu.plugins.get('cards against humanity').start(int.channel, false)
            .catch((err)=>err.type ? int.editReply('Unexpected Error. Try again later!') : int.editReply(err));
    }

};