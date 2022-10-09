const Command = require('../structures/Command');

module.exports = class Ping extends Command {
    constructor(k) {
        super(k);
        this.name = 'help',
        this.description = 'Get the bot\'s commands';

    }
    execute(int) {
        return this.reply(int, { 
            embeds: [
                {
                    title: 'List of all commands!',
                    color: '#BDB76B',
                    description: 'For a list of all commands, please refer to https://nixdevs.github.io/Kottu-Website/commands'
                }
            ]
        });
    }
};