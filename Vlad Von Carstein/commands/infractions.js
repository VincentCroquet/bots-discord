const moment = require('moment'),
    Discord = require('discord.js')

moment.locale('fr')

module.exports = {
    run: async (message, args, client) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre dont voir les warns.')
        if (!client.db.warns[member.id]) return message.channel.send('Ce membre n\'a aucun warn.')
        message.channel.send(new Discord.MessageEmbed()
            .setColor('fcf402')
            .setDescription(`**Total de warns :** ${client.db.warns[member.id].length}\n\n__**Warns**__\n\n${client.db.warns[member.id].map((warns, i) => `**${i + 1}.** ${warns.reason}\nSanctionné ${moment(warns.date).fromNow()} par <@!${warns.mod}>`).join('\n\n')}`))
    },
    name: 'infractions',
    help: {
        description: "**Description :** Cette commande permet de lister les infractions d'un membre.\n\n**Rôle requis :** @Modérateurs",
        syntax: "<@membre>"
    },
    guildOnly: true
}