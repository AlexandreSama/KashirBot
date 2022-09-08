const {
    Command
} = require('discord-akairo')
const {
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

class validerFicheCommand extends Command {
    constructor() {
        super('validerfiche', {
            aliases: ['validerfiche'],
            category: 'Mods',
            description: {
                content: "La commande validerfiche permet de valider une fiche",
                usage: 'validerfiche',
                examples: ['validerfiche']
            },
            slash: true,
            slashOptions: [{
                name: "nom",
                description: "nom du personnage de la fiche",
                type: 3,
                required: true
            },{
                name: "prenom",
                description: "prenom du personnage de la fiche",
                type: 3,
                required: true
            },{
                name: "lien",
                description: "lien de la fiche du personnage",
                type: 3,
                required: true
            },{
                name: "photo",
                description: "photo du personnage",
                type: 11,
                required: true
            }]
        })
    }

    execSlash(message){
    }

}

module.exports = validerFicheCommand