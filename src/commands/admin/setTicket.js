const {
    Command
} = require('discord-akairo')
const {
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

class setTicketCommand extends Command {
    constructor() {
        super('setticket', {
            aliases: ['setticket'],
            category: 'Administrator',
            description: {
                content: "La commande setticket permet de crée un embed",
                usage: 'setticket',
                examples: ['setticket']
            },
            slash: true,
        })
    }

    execSlash(message){
        const ticketEmbed = new EmbedBuilder()
            .setColor("#19a979")
            .setTitle('ouvrir un ticket afin de faire valider ta fiche !')
            .addFields({
                name: "\u200B", value: "Tu a terminé d'écrire ta fiche ? Excellent ! Tu peut désormais cliquer sur le bouton ci-dessous pour ouvrir un ticket afin que les juges-fiches puissent la valider !"
            })

        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('createticket')
					.setLabel('📩 Crée un ticket !')
					.setStyle(ButtonStyle.Primary),
			);

        message.interaction.reply({embeds: [ticketEmbed], components: [row]})
    }

}

module.exports = setTicketCommand