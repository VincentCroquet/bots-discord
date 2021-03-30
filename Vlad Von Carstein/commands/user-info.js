const Discord = require('discord.js'),
    moment = require('moment')

module.exports = {
    run: (message, args, client) => {
        const member = message.mentions.members.first() || message.member
        message.channel.send(new Discord.MessageEmbed()
            .setColor('fcf402')
            .addField('Membre', member, true)
            .addField('Tag', member.user.tag, true)
            .addField('Date de création du compte', moment(member.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'), true)
            .addField('Date d\'arrivée sur le serveur', moment(member.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'), true)
            .addField('Date de début de boost', member.premiumSince ? moment(member.premiumSince).format('[Le] DD/MM/YYYY [à] HH:mm:ss') : 'Ne boost pas', true)
            .addField('Infractions', client.db.warns[member.id] ? client.db.warns[member.id].length : 'Aucune', true)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter(`ID : ${member.id}`))
    },
    name: 'user-info',
    help: {
        description: "**Description :** Cette commande permet d'afficher toutes les informations d'un membre.\n\n**Rôle requis :** @Membres",
        syntax: '<@membre>'
    },
    guildOnly: true
}