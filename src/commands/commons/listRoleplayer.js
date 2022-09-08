const {
    Command
} = require('discord-akairo')
const {
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

class listRoleplayersCommand extends Command {
    constructor() {
        super('listroleplayers', {
            aliases: ['listrp'],
            category: 'Commons',
            description: {
                content: "La commande listrp permet de lister les personnages du RP",
                usage: 'listrp',
                examples: ['listrp']
            },
            slash: true,
        })
    }

    execSlash(message){
        this.client.users.cache.get('')
    }

}

module.exports = listRoleplayersCommand