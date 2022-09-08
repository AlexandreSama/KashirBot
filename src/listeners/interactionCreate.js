const {Listener} = require('discord-akairo');
const functions = require('../structure/functions')

class interactionCreateListener extends Listener{
    constructor(){
        super('interactionCreate', {
            emitter: 'client',
            event: 'interactionCreate',
        });
    }

    exec(interaction){
        if(interaction.isCommand()){
            switch (interaction.commandName) {
                case "addnumber":

                    let phoneNumber = interaction.options.data[0].value
                    let contactName = interaction.options.data[1].value
                    functions.addNumberToPhone(phoneNumber, contactName, interaction.user.id, interaction)
                break;

                case "validerfiche": 
                    functions.validerFiche(interaction)
                break;

                case "refuserfiche":

                break;
                case "listrp":
                    functions.listRoleplayers(interaction, this.client)
                break;
            }
        }else if (interaction.isButton()){
            switch (interaction.customId) {
                case "createticket":
                    functions.createTicket(interaction)
                break;

                case "refuserfiche": 
                    functions.refuserFiche(interaction)
                break;
                
                case "validerfiche":
                    functions.validerFiche(interaction)
                break;
            }
        }
    }
}

module.exports = interactionCreateListener