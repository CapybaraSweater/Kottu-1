const AsciiTable = require('ascii-table');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { readdirSync, readdir } = require('fs');
const { resolve, join } = require('path');

module.exports = class Kottu {
    /**
     * the client of clients
     * @param {import('../config.json')} config 
     */
    constructor(config) {
        this.config = config;
        this.logger = require('../transports/winston');   
        this.commands = new Collection();
        this.plugins = new Collection();
        this.db = require('../database/sqlite');
        this._body = [];
    }
    initiate() {
        this.client = new Client({
            intents: [ 
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
            ]
        });
        return this;
    }
    setPath(path) {
        this.path = path;
        return this;
    }
    /**
     * 
     * @param {import('discord.js').Guild} guild 
     * @param {String} reason 
     */
    leaveGuild(guild, reason) {
        guild.leave()
            .then(g => Promise.resolve(`Left guild ${g.name}, Reason: ${reason}`))
            .catch(Promise.reject);
    }
    isBlacklistedGuild(guild) {
        const isBlacklisted = this.db.guilds.getBlacklisted.pluck().get(guild.id);
        return isBlacklisted ? true : false;
    }
    isBlacklisted(user) {
        const isBlacklisted = this.db.users.getBlacklisted.pluck().get(user.id);
        return isBlacklisted ? true : false;
    }
    loadCommands(path) {
        this.logger.info('Caching Commands');
        let table = new AsciiTable('Commands'); 
        table.setHeading('File', 'Status');
        readdirSync(path).filter( f => f.endsWith('.js')).forEach( f => {
            const Command = require(resolve(__basedir, join(path,f)));
            const command = new Command(this);
            if (command.name && !command.disabled) {
                this.commands.set(command.name, command);
                table.addRow(f, '✅');   
                this._body.push(command);             
            } else {
                table.addRow(f, '❎');
                this.logger.warn(`${f} failed to load`);
                return;
            }   
        });        
        this.logger.info(`\n${table.toString()}`);
        return this;       
    }
    createCommands() {
        const productionMode = this.config.productionMode;
        if (!productionMode) return this;
        const rest = new REST({ version: '10' }).setToken(process.env.token);
        const commands = this._body.map(r=>{
            return {
                name: r.name,
                description: r.description,
                options: r.options
            };
        });
        (async () => {
            try {
                const bigBoyCommands = commands.filter(r=> r.ownerOnly);
                const littleBoyCommands = commands.filter(r=> !r.ownerOnly);

                this.logger.info(`Started refreshing ${commands.length} application (/) commands.`);
        
                const data = await rest.put(
                    Routes.applicationCommands(this.config.botId),
                    { body: littleBoyCommands },
                );
                const data2 = await rest.put(
                    Routes.applicationGuildCommands(this.config.botId, this.config.betaGuild),{ body: bigBoyCommands }
                );
        
                this.logger.info(`Successfully reloaded ${data.length} application (/) commands and ${data2.length} little boy commands.`);
            } catch (error) {
                this.logger.error(error);
            }
        })();
        return this;
    }
    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) this.logger.error(err);
            files = files.filter(f => f.split('.').pop() === 'js');
            if (files.length === 0) return this.logger.warn('No events found');
            this.logger.info(`${files.length} event(s) found...`);
            files.forEach(f => {
                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                this.client.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(resolve(__basedir, join(path, f)))]; // Clear cache
                this.logger.info(`Loading event: ${eventName}`);
            });
        });
        return this;
    }
    loadPlugins(path) {
        readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
            const plugins = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('index.js'));
            plugins.forEach(f => {
                const Plugin = require(resolve(__basedir, join(path, dir, f)));       
                const plugin = new Plugin(this);
                this.plugins.set(plugin.name, plugin);
                plugin.events.forEach(e=> {
                    if (plugin[e]) this.client.on(e, plugin[e].bind(plugin));
                });
                this.logger.info(`Plugin ${f} has been loaded!`);
            });
        });
        return this;
    }
};