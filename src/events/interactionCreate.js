/* eslint-disable no-unused-vars */

/**
 * 
 * @param {import('../structures/Kottu')} kottu 
 * @param {import('discord.js').Interaction} interaction 
 */
module.exports = (kottu, interaction) => {
    const { client } = kottu;
    if (interaction.isCommand()) {
        const { commandName } = interaction;
        if (!commandName) return;
        const command = kottu.commands.get(commandName);
        if (!command) return;
        try {
            const adminRole = kottu.db.guilds.getAdminRole.pluck().get(interaction.guildId);
            if (command.isAdmin) {
                if (adminRole && !interaction.member.roles.includes(adminRole)) {
                    return interaction.reply({ content: 'You are not admin!'});
                } else if (!interaction.member.permissions.has('MANAGE_GUILD')) {
                    return interaction.reply({ content: 'You are not an admin!'});
                }
            }

            const subCommand = command.options.find(f=> f.type === 1 && f.name === interaction.options.getSubcommand());
            command.execute(interaction).then(()=> {
                if (subCommand) return command[subCommand.name](interaction);
            });
        } catch(err) {
            kottu.logger.error(err.stack);
            return interaction.reply({ content: 'An unexpected error occurred!', ephemeral: true });
        }

    }
};