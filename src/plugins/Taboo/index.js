const Plugin = require('../../structures/Plugin');
const TabooGame = require('./Taboo');
module.exports = class TabooPlugin extends Plugin {
    constructor(kottu) {
        super(kottu);
        this.plugin = 'taboo';
        this.name = 'taboo';
        this.kottu = kottu;
        this.description = 'Play a game of taboo! Describe a word without breaking the rules!',
        this.points = 5;     
        this.games = {};   
    }
    randomCard() {
        const cards = require('../../assets/cards.json');
        return cards[Math.round(Math.random()*cards.length)];
    }
    createGame(channel, member) {
        if (this.games[channel.guild.id]) return Promise.reject('A game is already running');
        try {
            const game = new TabooGame(this, { channel, member });
            this.games[channel.guild.id] = game;
            Promise.resolve(game);
        } catch(err) {
            Promise.reject(err);
        }
        
    }
    stopGame(channel) {
        this.games[channel.id].forceStop();
        return Promise.resolve('Successfully stopped the ongoing game!');
    }
    interactionCreate(interaction) {
        if (interaction.isButton()) {
            const id = interaction.customId;

            const game = this.games[id];
            if (!game) return;
            if (game.participants.includes(interaction.user.id)) {
                game.participants.splice(game.participants.indexOf(interaction.user.id), 1);
                interaction.reply({content: `${interaction.user.tag} left!`});
            } else {
                game.participants.push(interaction.user.id);
                interaction.reply({content: `${interaction.user.tag} joined!`});

            }
        }
    }
};