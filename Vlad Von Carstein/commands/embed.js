const Discord = require('discord.js'),
    config = require('../config.json')

module.exports = {
    run: message => {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        message.channel.send(new Discord.MessageEmbed()
            .setAuthor('test **bonjour**', 'https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setThumbnail('https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setTitle('Mon titre')
            .setDescription('[Recherche Google](https://google.fr) **bonjour**')
            .setColor('RANDOM')
            .addField('Champ 1 **bonjour**', 'Bonjour c\'est moi **bonjour**', true)
            .addField('Champ 2', 'Blabla', true)
            .setImage('https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setFooter('Mon bot perso **bonjour**', 'https://cdn.discordapp.com/attachments/681950754176892936/801039462707625994/450.png')
            .setTimestamp()
            .setURL('https://google.fr')
        )
    },
    name: 'embed'
}