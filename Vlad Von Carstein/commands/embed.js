const Discord = require('discord.js')
 
module.exports = {
    run: message => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Mon titre')
            .setTitle('Autre titre **bonjour**')
            .setDescription('[Recherche Google](https://google.fr) **bonjour**')
            .setColor('RANDOM')
            .addField('Champ 1 **bonjour**', 'Bonjour c\'est moi **bonjour**', true)
            .addField('Champ 2', 'Blabla', true)
            .setAuthor('test **bonjour**', 'https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setImage('https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setFooter('Mon bot perso **bonjour**', 'https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setTimestamp()
            .setURL('https://google.fr'))
    },
    name: 'embed'
}