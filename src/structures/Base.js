
module.exports = class Base {
    /**
     * 
     * @param {import('../structures/Kottu')} kottu 
     */
    constructor(kottu) {
        this.kottu = kottu;
        /**
         * @type {Client} 
         */
        this.client = kottu.client;
        /**
         * @type {Object}
         */
        this.config = kottu.config;
        /**
         * @type {import('../transports/winston')}
         */
        this.logger = kottu.logger;
        /**
         * @type {import('../database/sqlite')}
         */
        this.db = kottu.db;

    }
    /**
     * 
     * @param {import('discord.js').Guild} guild 
     * @param  {...String} perms 
     * @returns {Boolean}
     */
    hasPermissions(guild, ...perms) {
        const clientMember = guild.members.cache.get(this.client.user.id);
        for (const perm of perms) {
            if (!clientMember.permission.has(perm)) return false;
        }

        return true;
    }
    /**
     * 
     * @param {import('discord.js').User} user 
     * @returns {Boolean}
     */
    isOwner(user) {
        return user.id === this.config.owner;
    }
    /**
     * 
     * @param {import('discord.js').TextBasedChannel} channel 
     * @param {import('discord.js').MessagePayloadOption|String} content 
     * @param {Object} options
     */
    sendMessage(channel, content, options={}) {
        if (!channel) {
            this.logger.warn('Channel undefined or empty');
            return Promise.resolve();
        }
        if (!content) {
            this.logger.warn('Message is undefined or empty');
            return Promise.resolve();
        }
        if (Array.isArray(content)) content = content.join('\n');
        if (typeof content === 'string') content = { content: content };
        return channel.send(content).then(msg=>{
            if (options.pin) msg.pin();
            if (options.deleteAfter) setTimeout(() => {
                msg.delete();                
            }, options.deleteAfter);
            return msg;
        }).catch((err)=> Promise.reject(err));

    }
    /**
     * reply to interaction
     * @param {import('discord.js').Interaction} interaction 
     * @param {import('discord.js').MessagePayloadOption|String} content 
     */
    reply(interaction, content) {
        if (!interaction || !interaction.isRepliable()) return Promise.resolve();
        if (!content) return Promise.resolve();
        if (Array.isArray(content)) content = content.join('\n');
        if (typeof content === 'string') content = { content: content };
        interaction.reply(content).catch(Promise.reject);
    }
    toBlock(str, lang = '') {
        return `\`\`\`${lang}\n${str}\`\`\``;
    }
    /**
     * Check if bot has channel perms
     * @param {import('discord.js').Channel} channel 
     * @param  {...String} perms 
     * @returns {Boolean}
     */
    hasChannelPermissions(channel, ...perms) {        
        if (channel.guild.me.permissionsIn(channel).has(...perms)) return true;
        else return false;        
    }
    
    parseAndGetStats(user) {
        let stats = this.db.users.getStats.pluck().get(user.id) || { coins: 0 };
        if (typeof stats === 'string') stats = JSON.parse(stats);
        return stats;
    }
    addGamePoint(user, game) {
        const stats = this.parseAndGetStats(user);
        stats[game] = stats[game] || { games: 0 };
        stats[game].games += 1;
        this.setStats(user, stats);
    }
    addCoins(user, coins) {
        const stats = this.parseAndGetStats(user);
        stats.coins += coins;
        this.setStats(user, stats);
    }
    setStats(user, data) {
        data = JSON.parse(data);
        this.db.users.setStats.run(data, user.id);
    }
};