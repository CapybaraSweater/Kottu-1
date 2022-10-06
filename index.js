require('dotenv').config();
const CustomClient = require('./src/structures/Kottu');
const config = require('./src/config.json');
require('dotenv').config();
global.__basedir = __dirname;
const Kottu = new CustomClient(config);
Kottu.initiate()
    .loadCommands('./src/commands')
    .loadEvents('./src/events')
    .createCommands()
    .loadPlugins('./src/plugins')
    .client.login(process.env.token);
