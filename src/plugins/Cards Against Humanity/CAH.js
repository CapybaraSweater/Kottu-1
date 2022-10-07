const { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Base = require('../../structures/Base');

module.exports = class CAH extends Base {
    constructor(module, channel, explicit) {
        super(module.kottu);
        this.module = module;
        this.channel = channel;
        this.data = [];
        this.voted = [];
        this.phrase = module.getPhrase(explicit);
        this.start();
    }
    async start() {
        const embed = {
            title: 'Cards against Humanity!',
            description: this.phrase.replace(/_/g, '_______'),
            footer: {
                text: 'Fill in the blank! Click the button to submit your answer!'
            }
        };
        const input = new TextInputBuilder()
            .setCustomId(this.channel.guild.id)
            .setLabel('Submission')
            .setPlaceholder('Be funny for once in your life')
            .setRequired(true)
            .setMaxLength(500)
            .setStyle(TextInputStyle.Short);
        this.modal = new ModalBuilder()
            .setCustomId(this.channel.guildId)
            .setTitle('Cards against humanity');
        const actionRow = new ActionRowBuilder().addComponents(input);

        const button = new ButtonBuilder()
            .setCustomId(this.channel.guild.id)
            .setLabel('Submit Answer!')
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder()
            .addComponents(button);
        
        const button2 = new ButtonBuilder()
            .setCustomId(this.channel.guild.id)
            .setLabel('Submit Answer!')
            .setStyle(ButtonStyle.Primary)
            .setDisabled();
        const buttonRow2 = new ActionRowBuilder()
            .addComponents(button2);
        this.modal.addComponents(actionRow);
        const msg = await this.channel.send({ embeds: [embed], components: [buttonRow] });
        setTimeout(()=> {
            msg.edit({ components: [buttonRow2] });
            this.startVote();
        }, 60*1000);            
    }
    startVote() {
        if (this.data.length<1) return this.lonely();
        const list = this.data.map((r, i)=>`**${i+1}.** ${this.phrase.replace(/_/g, '**'+ r.submission + '**')}`);
        this.channel.send(list.join('\n'));
        this.channel.send('Send your vote by choosing a number!');
        const collector = this.channel.createMessageCollector({ time: 60*1000});
        collector.on('collect', (m)=> {
            if (m.author.bot) return;
            if (this.voted.includes(m.author.id)) return;
            const num = parseInt(m.content);
            if (isNaN(num)) return;
            const selected = this.data[num-1];
            console.log(selected);
            if (!selected) return;
            if (selected.user === m.author.id) return;
            this.data[num].points += 1;
            this.voted.push(m.author.id);
            m.delete();
        });
        collector.on('end', ()=> {
            this.end();
        });
    }
    lonely() {
        delete this.module.games[this.channel.guild.id];
        return this.channel.send('Cancelled due to less than 2 submissions');
    }
    end() {
        const lb = this.data.sort((a, b)=> {
            return b.points - a.points;
        });
        const winner = lb[0];
        return this.channel.send({
            embeds: [
                {
                    title: this.channel.guild.members.cache.get(winner.user).user.tag  + ' won!',
                    description: this.phrase.replace(/_/g, `**${winner.submission}**`),
                    footer: { text: 'Achieved a total of ' + winner.points + ' points' }
                }
            ]
        });
    }
    async interactionCreate(int) {

        if (int.isButton()) {
            console.log(int.customId);
            if (int.customId !== this.channel.guild.id) return;
            console.log('a');
            
            await int.showModal(this.modal);
        }
        if (int.isModalSubmit()) {
            if (this.data.find(r=>r.user === int.user.id)) return;
            const submission = int.fields.getTextInputValue(int.guildId);

            this.data.push({ user: int.user.id, submission: submission, points: 0 });
            return int.reply({ content: 'Submitted!', ephemeral: true });
        }

    }
};
//
