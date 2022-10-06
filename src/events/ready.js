module.exports = (kottu, client) => {
    kottu.logger.info(`Logged in as ${client.user.tag}!`);
    kottu.logger.info(`Watching over ${client.guilds.cache.size} servers`);
};