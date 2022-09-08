const {
    Command
} = require('discord-akairo')

class AddNumberCommand extends Command {
    constructor() {
        super('addnumber', {
            aliases: ['addnumber'],
            category: 'Roleplay',
            description: {
                content: "Permet d'ajouter",
                usage: 'addnumber',
                examples: ['addnumber Djinn 0604125235']
            },
            slash: true,
            slashOptions: [{
                name: "numéro",
                description: "numéro de téléphone",
                required: true,
                type: 10
            },{
                name: "nom",
                description: "nom du contact",
                required: true,
                type: 3
            }]
        })
    }

    execSlash(message){
    }

}

module.exports = AddNumberCommand