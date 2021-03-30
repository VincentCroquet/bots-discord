const fs = require('fs')

module.exports = {
    run: async (message, args, client) => {
        const channel = message.mentions.channels.first() || message.channel
        if (!client.db.tickets[channel.id]) return message.channel.send('Ce salon n\'est pas un ticket.')
        if (!message.member.hasPermission('MANAGE_MESSAGES') && client.db.tickets[channel.id].author !== message.author.id) return message.channel.send('Vous n\'avez pas la permission de fermer ce ticket.')
        delete client.db.tickets[channel.id]
        fs.writeFileSync('./db.json', JSON.stringify(client.db))
        await message.channel.send(`Le ticket de ${message.member} est clot, ${channel} va être supprimé !`)
        setTimeout(() => { channel.delete(); }, 3e3);
    },
    name: 'close',
    help: {
        description: "**Description :** Cette commande permet de fermer un ticket.\n\n**Rôle requis :** @Membres",
        syntax: ""
    },
    guildOnly: true
}