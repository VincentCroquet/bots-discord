const config = require('../config.json'),
    fs = require('fs'),
    Discord = require('discord.js')

module.exports = {
    run: async (message, args, client) => {
        if (Object.values(client.db.tickets).some(ticket => ticket.author === message.author.id)) return message.channel.send('Vous avez déjà un ticket d\'ouvert.')
        const channel = await message.guild.channels.create(`ticket de ${message.author.username}`, {
            type: 'text',
            parent: config.ticket.category,
            permissionOverwrites: [{
                id: message.guild.id,
                deny: 'VIEW_CHANNEL'
            }, {
                id: message.author.id,
                allow: 'VIEW_CHANNEL'
            }, ...config.ticket.roles.map(id => ({
                id,
                allow: 'VIEW_CHANNEL'
            }))]
        })
        client.db.tickets[channel.id] = {
            author: message.author.id
        }
        fs.writeFileSync('./db.json', JSON.stringify(client.db))
        channel.send(`Bonjour ${message.member}, bienvenue dans votre ticket. Un Administrateur va venir s'occuper de vous, Merci de patienter. :sunglasses:`)
        message.channel.send(`Votre ticket à été créé avec succès ! Rendez-vous dans ${channel}`)
        const StaffChannel = client.channels.cache.find(channel => channel.id === "798865668953997322")
        StaffChannel.send(`<@&798477177732726814> ${message.member} à créer un ticket, réponder à ça requête dans ${channel}`)
    },
    name: 'ticket',
    help: {
        description: 'Cette commande permet de créer un ticket (créer un salon spécifique avec le demandeur et les admins pour une requête).\n\n**Rôle requis :** @Membres',
        syntax: ""
    },
    guildOnly: true
}