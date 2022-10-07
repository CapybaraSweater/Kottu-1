const { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Base = require('../../structures/Base');

module.exports = class CAH extends Base {
    constructor(module, channel, explicit) {
        super(module.kottu);
        this.module = module;
        this.channel = channel;
        this.data = [];
        this.phrase = module.getPhrase(explicit);
        this.start();
    }
    async start() {
        const embed = {
            title: 'Cards against Humanity!',
            description: this.phrase,
            footer: {
                text: 'Click the button to submit your answer!'
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
        const buttonRow2 = new ActionRowBuilder()
            .addComponents(button.setDisabled(true));
        this.modal.addComponents(actionRow);
        const msg = await this.channel.send({ embeds: [embed], components: [buttonRow] });
        setTimeout(()=> {
            msg.edit({ components: [buttonRow2] });
            this.startVote();
        });            
    }
    startVote() {
        if (!this.data.length) return this.lonely();
        const list = this.data.map((r, i)=>`**${i+1}.** ${this.phrase.replace(/_/g, r.submission)}`);
        this.channel.send(list.join('\n'));
        const collector = this.channel.createMessageCollector({ time: 60*1000});
        collector.on('collect', (m)=> {
            const num = parseInt(m.content);
            if (isNaN(num)) return;
            const selected = this.data[num];
            if (!selected) return;
            if (selected.user === m.author.id) return;
            this.data[num].points += 1;
        });
        collector.on('end', ()=> {
            this.end();
        });
    }
    lonely() {

    }
    end() {

    }
    interactionCreate(int) {

        if (int.isButton()) {
            if (int.customId !== this.channel.guild.id) return;
            int.showModal(this.modal);
        }
        if (int.isModalSubmit()) {

            const submission = int.fields.getTextInputValue(int.guildId);
            this.data.push({ user: int.user.id, submission: submission, points: 0 });
            return int.reply({ content: 'Submitted!', ephemeral: true });
        }

    }
};
//
