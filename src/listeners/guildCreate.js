const {Listener} = require('discord-akairo');
const functions = require('../structure/functions')

class guildCreateListener extends Listener{
    constructor(){
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate',
        });
    }

    exec(guild){
        
    }
}

module.exports = guildCreateListener