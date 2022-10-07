const Plugin = require('../../structures/Plugin');
const Game = require('./CAH');
module.exports = class CardsAgainstHumanityPlugin extends Plugin {
    constructor(...args) {
        super(...args);
        this.name = 'Cards against humanity';
        this.description = 'Complete the sentence to make the funniest phrase.';
        this.games = {};
    }
    getPhrase(explicit) {
        let file = 'cah.json';
        if (explicit === true) file = 'expl-cah.json';
        const json = require('../../assets/'+file);
        const b = json[0].black.filter(r=>r.pick===1);
        let text =  b[Math.round(Math.random()*b.length)].text;
        if (!text.includes('_')) text = text + ' _.';
        return text;
    }
    start(channel, explicit) {
        if (this.games[channel.id]) return channel.send('A game is already running in this channel');
        const game = new Game(this, channel, explicit);
        return this.games[channel.guild.id] = game;
    }
    async interactionCreate(int) {
        if (int.isButton()) {
            
            if (!this.games[int.customId]) return;
            if (this.games[int.customId].data.find(r=>r.user === int.user.id)) return int.reply({content:'u cant submit again', ephemeral: true});
            if (int.customId !== int.channel.id) return;
            
            await int.showModal(this.games[int.customId].modal);
        }
        if (int.isModalSubmit()) {
            if (!this.games[int.customId]) return;
            const submission = int.fields.getTextInputValue(int.guildId);
            this.games[int.customId].data.push({ user: int.user.id, submission: submission, points: 0 });
            return int.reply({ content: 'Submitted!', ephemeral: true });
        }        
    }

};