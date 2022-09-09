const Client = require('./structure/client')
const config = require('./config.json')
const Discord = require('discord.js');
const Canvas = require('@napi-rs/canvas')
const fs = require('fs')
const { join } = require('path')

let client = new Client({
    prefix: ';',
})
  
process.on('unhandledRejection', error => {
    console.log(error)
})
process.on('uncaughtException', error => {
    console.log(error)
})

client.on('error', (err) => {
    console.log(err)
})

console.log("Version de Discord-Akairo (Framework pour DJS) : " + require('discord-akairo').version)
console.log('Version de DJS : ' + Discord.version)
console.log('Version de MySQL2 : 2.3.3')
client.login(config.token).then(() => {
    console.log('Bot chargé !')
})

const canva = Canvas.createCanvas(1080, 2340)
const ctx = canva.getContext('2d')

ctx.beginPath();

ctx.fillStyle = '#55a851';
ctx.fillRect(0, 0, 1080, 250)

ctx.fillStyle = '#646060'
ctx.fillRect(0, 250, 1080, 2100)

ctx.fillStyle = '#000000'
ctx.font = "70px Arial"
ctx.fillText('Vos contacts !', 340, 150)

ctx.fillStyle = '#000000'
ctx.font = '60px Arial'
ctx.fillText('Alexandre', 200, 450)

Canvas.loadImage('./src/img/left-arrow.png').then((data) => {
    ctx.drawImage(data, 90, 50, 150, 150)
    let imgBuffer = canva.toBuffer('image/png')
    fs.writeFileSync('simple.png', imgBuffer)
})

module.exports = client