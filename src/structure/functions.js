const mysql2 = require('mysql2')
const config = require('../config.json')
const fs = require('fs')
const {
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
    ThreadAutoArchiveDuration,
    SelectMenuBuilder,
} = require('discord.js');
const Canvas = require('@napi-rs/canvas')
const Downloader = require('nodejs-file-downloader')

/* It's creating a connection to the database. */
const connection =  mysql2.createConnection({
    host: config.databaseHost,
    user: config.databaseUsername,
    password: config.databasePassword,
    database: config.databaseName,
    supportBigNumbers: true
});

function addNumberToPhone(number, nickname, idUser, interaction){

    connection.query(`SELECT phoneContact FROM roleplayers WHERE userID = "${idUser}"`, function(err, result) {
        if(err){
            interaction.reply('Etrange... Il y a une erreur.. Contacte vite un MJ ou un Administrateur et donnent leur cet erreur : ' + err.message)
        }

        if(result.length > 0){
            let data = JSON.parse(JSON.stringify(result[0].phoneContact))
            let newContact = {
                number: number,
                nameContact: nickname
            }
            data.push(newContact)
            let readyToSendData = JSON.stringify(data)
            connection.query(`UPDATE roleplayers SET phoneContact = '${readyToSendData}' WHERE userID = "${idUser}"`, function(err, result){
                if(err){
                    interaction.reply('Etrange... Il y a une erreur.. Contacte vite un MJ ou un Administrateur et donnent leur cet erreur : ' + err.message)
                }
                if(result){
                    interaction.log('Contact enregistré !')
                }
            })
        }else{
            interaction.reply('Etrange.. Je ne te vois pas dans mon registre ! Contacte vite un MJ ou un administrateur !')
        }
    })
}

async function listContact(idUser, interaction) {
    
    connection.query(`SELECT phoneContact FROM roleplayers WHERE userid = "${idUser}"`, function(err, result){
        if(err){

        }
        
        if(result.length > 0){
            let data = JSON.parse(JSON.stringify(result[0].phoneContact))

            const canva = Canvas.createCanvas(1080, 2340)
            const ctx = canva.getContext('2d')
            ctx.rect(0, 0, 150, 150)

            

        }else{
            interaction.reply('Vous n\'avez aucun contact dans votre téléphone !')
        }
    })
}

function sendMessage() {
    
}

function createTicket(interaction, ){
    let verifRole = interaction.guild.roles.cache.find(role => role.name == "Vérificateur")
    let category = interaction.guild.channels.cache.find(cat => cat.name == "tickets")
    if (interaction.guild.channels.cache.find(channel => channel.name == `ticket-de-${interaction.user.username}`) !== undefined) {
        interaction.reply('Tu a déjà un ticket ouvert !')
    } else {
        interaction.guild.channels.create({
            name: `ticket-de-${interaction.user.username}`,
            parent: category.id,
            type: ChannelType.GuildText,
        }).then(channel => {
            channel.permissionOverwrites.set([
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                },
                {
                    id: verifRole.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                }])

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('validerfiche')
                        .setLabel('Fiche validé !')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✅')
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('refuserfiche')
                        .setLabel('Fiche refusé !')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('❎')
                )
            const exampleEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Vérification de fiche')
                .setDescription(`<@${interaction.user.id}>, tu peut poster ta fiche ici ! \n Quand les modérateurs l'auront validé, tu sera tenu au courant et ton ticket sera fermé `)
            channel.send({
                embeds: [exampleEmbed],
                components: [row]
            })
            channel.send(`<@${interaction.user.id}>`).then(message => {
                message.delete()
            }).then(messageChzn => {
                channel.threads.create({
                    name: "Discussion-fiche-de-" + interaction.user.username,
                    autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                })
            })
        }).catch(err => {
            console.log(err)
            interaction.reply(`Une erreur s'est produite, merci d'en informer mon créateur !`)
        })
    }
}

function refuserFiche(interaction) {
    interaction.channel.messages.fetch({limit: 10})
        .then((messages) => {
            let Messages = Array.from(messages)
            let userFiche = Messages[1]
            let reasonRefuser = Messages[0]
            const refuserEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Kashir'})
            .setColor('Red')
            .setTitle('Fiche Refusé !')
            .addFields({
                name: `Fiche refusé de : ${userFiche[1].author.username}`,
                value: `${userFiche[1].content}`
            },{
                name: 'Pour la raison suivante :',
                value: `${reasonRefuser[1].content}`
            })

            interaction.guild.channels.cache.get("1011618506615308298").send({embeds: [refuserEmbed]})
            interaction.channel.delete('Fiche Refusé !')
        })
}

function validerFiche(interaction, nomPersonnage, prenomPersonnage, lienPersonnage) {

    console.log(process.cwd())
    console.log(interaction.options.data)
    let personnageFirstName = interaction.options.data[0].value
    let personnageLastName = interaction.options.data[1].value
    let personnageLien = interaction.options.data[2].value
    let personnagePhoto = interaction.options.data[3].attachment.url
    interaction.channel.messages.fetch({limit: 10})
        .then((messages) => {
            let Messages = Array.from(messages)
            let userFiche = Messages[0]
            console.log(Messages)
            const accepterEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Kashir'})
            .setColor('Red')
            .setTitle('Fiche Validé !')
            .addFields({
                name: `Fiche validé de : ${userFiche[1].author.username}`,
                value: `${userFiche[1].content}`
            })
            interaction.guild.channels.cache.get("1011619104165220352").send({embeds: [accepterEmbed]})
            interaction.channel.delete('Fiche Accepté !')

            const downloadPhotoPersonnage = new Downloader({
                url: personnagePhoto,
                directory: process.cwd() + '/roleplay/personnages/images/' + personnageLastName + '/',
                fileName: personnageLastName + '.jpg'
            })

            downloadPhotoPersonnage.download()
            connection.query(`INSERT INTO roleplayers (userID, personnageNom, personnagePrenom, lienFichePersonnage) VALUES ("${userFiche[1].author.id}", "${personnageFirstName}", "${personnageLastName}", "${personnageLien}")`, function(err, result){
                if(err){
                    console.log(err)
                }else{
                    console.log('tout s\'est bien passé')
                }
            })
    })
}

async function listRoleplayers(interaction, client) {
    connection.query(`SELECT * FROM roleplayers`, async function(err, result){
        if(err){
            interaction.reply('Etrange... Je viens d\'avoir une erreur bizarre !')
            console.log('[BDD-ListRoleplayers-' + new Date() + ' : ' + err.message)
        }
        if(result >= 5){
            
        }else{
            console.log(client)
            let i = 0

            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('listPersoRP')
                        .setPlaceholder('Liste des personnages du RP')
                )

            let dropdown = row.components[0]
            let optionsFull = []

            result.forEach(async (element) => {
                if(result.length <= 5){
                    // embedList.addFields({
                    //     name: '\u200B',
                    //     value: '\u200B'
                    // },{
                    //     name: 'Personnage de : ',
                    //     value: client.users.cache.get(element.userID).username
                    // },{
                    //     name: "Nom / Prénom du personnage : ",
                    //     value: element.personnageNom + ' / ' + element.personnagePrenom,
                    //     inline: true
                    // },{
                    //     name: 'Lien vers la fiche du personnage : ',
                    //     value: element.lienFichePersonnage,
                    //     inline: true
                    // },{
                    //     name: 'Photo du personnage : ',
                    //     value: config.website + '/roleplay/personnages/images/' + element.personnagePrenom + '/' + element.personnagePrenom + '.jpg',
                    // },{
                    //     name: '\u200B',
                    //     value: '-----------------------'
                    // })

                    console.log(element)
                    optionsFull.push({
                        label: element.personnageNom + ' ' + element.personnagePrenom,
                        description: 'Personnage de ' + client.users.cache.get(element.userID).username,
                        value: element.personnagePrenom
                    })
                    await dropdown.setOptions(optionsFull)
                    await interaction.reply({components: [row]})
                }else{
                    while (i <= 5) {
                        embedList.addFields({
                            name: 'Personnage de : ',
                            value: client.users.cache.get(element.userID).username
                        },{
                            name: "Nom / Prénom du personnage : ",
                            value: element.personnageNom + ' / ' + personnagePrenom,
                            inline: true
                        }, {
                            name: 'Lien vers la fiche du personnage : ',
                            value: element.lienFichePersonnage,
                            inline: true
                        })

                        ++i
                    }

                    const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previouspage')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('◀️')
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('nextpage')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('▶️')
                    )

                    await interaction.reply({embeds: [embedList], components: [row]})
                }
            })
        }
    })
}

async function getSpecificCharacter(characterName, interaction, client) {
        connection.query(`SELECT * FROM roleplayers WHERE personnagePrenom = "${characterName}"`, async function(err, result){
            if(err){
                console.log(err)
            }

            if(result){
                const embedInfos = new EmbedBuilder()
                .setAuthor({name: client.user.username, iconURL: client.user.avatarURL({
                    extension: "jpg",
                })})
                .setTitle("Présentation de " + characterName)
                .addFields({
                    name: "Nom :",
                    value: result[0]['personnageNom'],
                    inline: true
                },{
                    name: "Prénom : ",
                    value: result[0]['personnagePrenom'],
                    inline: true
                },{
                    name: "Personnage de : ",
                    value: client.users.cache.get(result[0]['userID']),
                    inline: true
                })
                .setImage('http://193.168.146.71/KashirBot/src/roleplay/personnages/images/' + result[0]['personnagePrenom'] + '/' + result[0]['personnagePrenom'] + '.jpg')

                await interaction.reply({embeds: [embedInfos]})
            }
        })
}
module.exports = {
    connection,
    addNumberToPhone,
    createTicket,
    refuserFiche,
    validerFiche,
    listRoleplayers,
    getSpecificCharacter
}