const { stripIndents } = require('common-tags');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Base = require('../../structures/Base');
//this.endRound endGame validateStr sleep setPoint
module.exports = class Taboo extends Base {
    constructor(module, options) {
        super(module.kottu);
        this.module = module;
        this.channel = options.channel;
        this.guild = this.channel.guild;
        this.member = options.member;
        this.participants = [];
        this.points = {};
        this.index = 0;          
        this.current = null;
        this.isRunning = true;
        this.collector();       
    }
    async collector() {
        if (!this.channel) return;
        const embed = {
            title: `A game of taboo has started by ${this.member.user.username}`,
            description: stripIndents`
            Click on the button to join or leave! If you do not know how to play, please type \`/taboo info\` for more information!
            Remember to follow the rules and have fun! Game starts in one minute!
            `,
            footer: {
                text: 'Note: Only one game of taboo can be played in a server.'
            }
        };
        const enabledRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${this.guild.id}`)
                    .setLabel('JOIN')
                    .setStyle(ButtonStyle.Success),
            );
        const disabledRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${this.guild.id}`)
                    .setLabel('JOIN')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
            );
        const msg = await this.channel.send({
            embeds: [embed],
            components: [enabledRow]
        });  
        setTimeout(() => {
            msg.edit({
                embeds: [embed],
                components: [disabledRow]
            });
            const members = this.participants.map(p=> {
                const listed = this.guild.members.cache.get(p);
                if (listed) return listed.toString();
                else return '***unknown***';
            });
            this.channel.send({ embeds: [
                {
                    title: 'Participant Total: ' + members.length,
                    description: members.join(',')
                }
            ]});
            this.processRound();
        }, 60000);

    } 

    processRound() {
        if (!this.isRunning) return; //this.endGame();
        const memberId = this.participants[this.index];
        const member = this.guild.members.cache.get(memberId);
        this.word = this.module.randomCard();
        this.current = member;
        if (!member) return this.endRound();
       
        member.send({
            embeds: [
                {
                    description: stripIndents`
                    **Word:**: \`${this.word.word}\`
                    **Taboo:** \`${this.word.taboo.join('`, `')}\`
                    `
                }
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL(this.channel.url)
                            .setLabel('Back to channel')
                    )
            ]
        })
            .catch(()=>{
                this.channel.send('Couldn\'t send DM! Skipping...');
                this.endRound();
            });
        this.channel.send(`${member}, word has been sent in DMs. You have a minute to describe your word!`);
        const collector = this.channel.createMessageCollector({
            time: 60 * 1000
        });
        this.col = collector;
        collector.on('collect', msg=> {
            if (!this.participants.includes(msg.author.id)) return;
            if (msg.author.id === member.id) {
                if (this.validateStr(msg.content) === false) {
                    console.log('a');
                    this.setPoint(member, -3);
                    this.channel.send({embeds: [{
                        title: 'You broke the taboo!',
                        description: 'For being bad at the game, you recieved `-3` points'
                    }]});
                    collector.stop();
                }
            } else {
                if (msg.content.toLowerCase()===this.word.word.toLowerCase()) {
                    this.setPoint(msg.author, 1);
                    this.setPoint(member, 2);
                    this.channel.send(stripIndents`
                    ${msg.author} guessed the word and recieved \`1 point\`
                    ${member} recives \`2 points\`
                    `);
                    collector.stop();
                }
            }

        });
        collector.on('end',()=> this.endRound());
    }
    async endRound() {
        const embed = {
            title: 'Round Ended!',
            description: stripIndents`
            **Word:** \`${this.word.word}\`
            **Disallowed Words:** \`${this.word.taboo.join(', ')}\`,
            `,
            footer: {
                text: 'Continuing in 10 seconds'
            }
        };
        this.channel.send({
            embeds: [embed]
        });
        if (!this.participants[this.index+1]) return this.endGame();
        await this.sleep(10 * 1000);
        this.index += 1;
        return this.processRound();
    }
    endGame() {
        const key = Object.keys(this.points);
        const map = key.map(k => `<@${k}>: \`${this.points[k]}\``);
        delete this.module.games[this.guild.id];
        this.channel.send({
            embeds: [
                {
                    title: 'Game Ended! Here are the points!',
                    description: stripIndents`${map.join('\n') || 'Noone scored any points LOL'}`,
                    footer: { text: 'Thanks for playing!' }
                }
            ]
        });
    }
    sleep(ms) {
        return new Promise((res) => {
            this.time = setTimeout(() => {
                res();
            }, ms);
        });
    }

    validateStr(str) {
        const word = this.word;
        var returns;
        str = str.toLowerCase();
        const tabooed = word.taboo;
        if (str.includes(word.word.toLowerCase())) returns = false;
        tabooed.forEach(s => {
            if (str.toLowerCase().includes(s.toLowerCase())) returns = false;
        });
        if (returns === false) return false;

        return true;
    }
    setPoint(member, point) {
        this.points[member.id] = this.points[member.id] || 0;
        this.points[member.id] = this.points[member.id] + point;
    }
    forceStop(channel) {
        delete this.module.games[channel.guild.id];
        this.col ? this.col.stop() : false;
        clearTimeout(this.time);
    }
};