const {AkairoClient, CommandHandler, ListenerHandler} = require('discord-akairo')

module.exports = class Client extends AkairoClient {
    constructor(config = {}){
        super(
            {ownerID: '256892994504884224'},
            {
                allowedMentions: {
                    parse: ['roles', 'everyone', 'users'],
                    repliedUser: false
                },
                partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'],
                intents: 32767,
            },

        );

        this.CommandHandler = new CommandHandler(this, {
            allowMention: true,
            prefix: config.prefix,
            defaultCooldown: 2000,
            directory: './src/commands/',
            autoRegisterSlashCommands: true
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/listeners/',
        })

        this.CommandHandler.loadAll();
        this.CommandHandler.useListenerHandler(this.listenerHandler)
        this.listenerHandler.loadAll()
    }
}