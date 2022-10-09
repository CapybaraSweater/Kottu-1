module.exports = (kottu, client) => {
    kottu.logger.info('Starting sqlite3 database');
    kottu.client.guilds.cache.forEach(guild=> {

        kottu.db.guilds.insertRow.run(guild.id);
    });
    kottu.client.users.cache.forEach(user=>kottu.db.users.insertRow.run(user.id));

    kottu.logger.info(`Logged in as ${client.user.tag}!`);
    kottu.logger.info(`Watching over ${client.guilds.cache.size} servers`);
};