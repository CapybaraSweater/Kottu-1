const Command = require('../structures/Command');

module.exports = class AdminRole extends Command {
    constructor(k) {
        super(k);
        this.name = 'adminrole';
        this.description = 'Set an admin role for the server which allows access to config commands.';
        this.options = [
            {
                type: 8,
                name: 'role',
                description: 'Leave blank to clear the admin role'                
            }
        ];
        this.admin = true;

    }
    execute(int) {
        const role = int.options.getRole('role')||null;
        if (!role) {
            this.db.guilds.setAdminRole.run(null, int.guild.id);
            return this.reply(int, { content: 'Set the admin role to `none`'});
        }
        console.log(role.id);
        this.db.guilds.setAdminRole.run(role.id, int.guild.id);
        return this.reply(int, { content: `Set the admin role to \`${role.name}\``});


        
    }
};