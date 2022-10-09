const Command = require('../structures/Command');

module.exports = class Ping extends Command {
    constructor(k) {
        super(k);
        this.name = 'disableplugin',
        this.description = 'Disable a plugin for the server';
        this.admin = true;

        this.options = [
            {
                type: 3,
                name: 'plugin',
                description: 'The plugin to enable',
                required: true,
                choices: [
                    {
                        name: 'taboo',
                        value: 'taboo'
                    },
                    {
                        name: 'Cards against humanity',
                        value: 'cards against humanity'
                    }
                ]
            }
        ];

    }
    execute(int) {
        const plugin = int.options.getString('plugin');
        let plugins = this.db.guilds.getDisabledPlugins.pluck().get(int.guild.id) || [];
        if (typeof plugins === 'string') plugins = plugins.split(',');
        if (plugins.includes(plugin)) return this.reply(int, 'This plugin is already disabled');
        plugins.push(plugin);
        console.log(plugins.join(','));
        this.db.guilds.setDisabledPlugins.run(plugins.join(' ') || null, int.guild.id);
        return this.reply(int, `Successfully disabled ${plugin} plugin`);
    }
};