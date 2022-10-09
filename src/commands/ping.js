const Command = require('../structures/Command');

module.exports = class Ping extends Command {
    constructor(k) {
        super(k);
        this.name = 'ping',
        this.description = 'Get the bot\'s latency';

    }
    execute(int) {
        console.log(this.db.guilds.getRow.get(int.guild.id));
        return this.reply(int, { content: `Pong 🏓 | \`${this.client.ws.ping} ms\``, ephemeral: true });
    }
};