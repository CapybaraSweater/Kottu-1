const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

// Set pragmas
db.pragma('synchronous = 1');

db.pragma('journal_mode = wal');

db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
        guild_id TEXT PRIMARY KEY,
        admin_role TEXT,
        disabled_plugins TEXT,
        blacklisted INTEGER NOT NULL
    );
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        banner TEXT,
        phrase TEXT,
        color TEXT,
        blacklisted INTEGER NOT NULL,
        inventory TEXT,
        stats TEXT
    )
`).run();
const guilds = {
    insertRow         : db.prepare('INSERT OR IGNORE INTO settings (guild_id, blacklisted) VALUES (?, 0);'),
    getRow            : db.prepare('SELECT * FROM settings WHERE guild_id = ?;'),
    getGuilds         : db.prepare('SELECT guild_id FROM settings'),
    getAdminRole      : db.prepare('SELECT admin_role FROM settings WHERE guild_id = ?;'),
    getBlacklisted    : db.prepare('SELECT blacklisted FROM settings WHERE guild_id = ?;'),
    getDisabledPlugins: db.prepare('SELECT disabled_plugins FROM settings WHERE guild_id = ?;'),

    setAdminRole      : db.prepare('UPDATE settings SET admin_role = ? WHERE guild_id = ?;'),
    setDisabledPlugins: db.prepare('UPDATE settings SET disabled_plugins = ? WHERE guild_id = ?;'),
    setBlacklisted    : db.prepare('UPDATE settings SET blacklisted = ? WHERE guild_id = ?;'),
};
const user = {
    insertRow         : db.prepare('INSERT OR IGNORE INTO users (user_id, blacklisted) VALUES (?, 0);'),
    getRow            : db.prepare('SELECT * FROM users WHERE user_id = ?;'),
    getBanner         : db.prepare('SELECT banner FROM users WHERE user_id = ?;'),
    getPhrase         : db.prepare('SELECT phrase FROM users WHERE user_id = ?;'),
    getColor          : db.prepare('SELECT color FROM users WHERE user_id = ?;'),
    getBlacklisted    : db.prepare('SELECT blacklisted FROM users WHERE user_id = ?;'),
    getStats          : db.prepare('SELECT stats FROM users WHERE user_id = ?;'),

    setBanner         : db.prepare('UPDATE users SET banner = ? WHERE user_id = ?;'),
    setPhrase         : db.prepare('UPDATE users SET phrase = ? WHERE user_id = ?;'),
    setColor          : db.prepare('UPDATE users SET color = ? WHERE user_id = ?;'),
    setBlacklisted    : db.prepare('UPDATE users SET blacklisted = ? WHERE user_id = ?;'),
    setStats          : db.prepare('UPDATE users SET stats = ? WHERE user_id = ?;'),
};
exports.guilds = guilds;
exports.users = user;