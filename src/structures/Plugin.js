const Base = require('./Base');

module.exports = class Plugin extends Base {
    constructor(kottu) {
        super(kottu);

        this.name = this.constructor.name;
        this.events = ['messageCreate', 'interactionCreate'];
        
    }
    isEnabled(guild, plugin) {
        let plugins = this.db.guilds.getDisabledPlugins.pluck().get(guild.id) || [];
        if (typeof plugins === 'string') plugins = plugins.split(' ');
        if (plugins.includes(plugin)) return false;
        else return true;
    }
    getWinnerEmbed(user, game, coins) {
        const id = user.id;
        const banner = this.db.users.getBanner.pluck().get(id);
        const phrase = this.db.users.getPhrase.pluck().get(id);
        const color = this.db.users.getColor.pluck().get(id);
        
        const embed = {
            color: color,
            title: `${user.username} is the winner of ${game}!`,
            description: `> 🖋️ ${phrase || 'Good Game!'}`,
            image: { url: banner || null },
            footer: `You gained ${coins} coins!`
        };
        this.sendMessage(this.channel, { embeds: [embed] });

    }
};