const { stripIndents } = require('common-tags');
const Command = require('../structures/Command');

module.exports = class Taboo extends Command {
    constructor(kottu) {
        super(kottu);
        this.name = 'taboo';
        this.description = 'All your taboo plugin commands';
        this.options = [
            {
                'type': 1,
                'name': 'info',
                'description': 'Get your taboo stats',
                'options': []
            },
            {
                'type': 1,
                'name': 'start',
                'description': 'Start a new game of taboo',
                'options': []
            },
            {
                'type': 1,
                'name': 'stop',
                'description': 'Stops an ongoing game!',
                'options': []
            }
        ];
    }
    execute() {
        return Promise.resolve();
    }
    start(interaction) {
        interaction.reply('Creating a new game!');
        return this.kottu.plugins.get('taboo').createGame(interaction.channel, interaction.member);
            
    }
    stop(interaction) {
        return this.kottu.plugins.get('taboo').stopGame(interaction.channel);
    }
    info(interaction) {
        const info = stripIndents`
        **Basic Rules**
        **1.** You cannot bypass the words through substitution, space out, or additional letters that can override the filter.
        eg: You cannot type apple through \`a p p l e\` or \`@pple\`!

        **2.** Do not team with players, through DMs or voice calls!

        **3.** If you find any word weird, report it in the official server using \`/support\`
        
        **4.** Do not be toxic while playing. The game is to have fun overall! 

        **How to play**
        Upon entering, each player gets a chance to describe a word without using the list of banned words given!
        You are given a minute to describe. Breaking this will trigger a subtraction of 3 points. When guessing, you must 
        type the word that the member is trying to describe. The member with the most number of points wins!
        `;
        this.reply(interaction, {
            embeds: [
                {
                    title: 'Taboo Info',
                    description: info,
                    color: 0xFF5733
                }
            ]
        });
        
    }
};