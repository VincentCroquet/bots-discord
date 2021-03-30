module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const count = args[0]
        if (!/\d+/.test(count)) return message.channel.send('Veuillez indiquer un nombre de messages à supprimer.')
        if (count < 1 || count > 99) return message.channel.send('Le nombre de message doit être compris entre 1 et 99.')
        const { size } = await message.channel.bulkDelete(Number(count) + 1, true)
        message.channel.send(`${size - 1} messages ont été supprimés !`).then(sent => sent.delete({timeout: 2e3}))
    },
    name: 'clear',
    help: {
        description: "**Description :** Cette commande permet de supprimer plusieur message d'un coup.\n\n**Rôle requis :** @Modérateurs",
        syntax: "[nombre]"
    },
    guildOnly: true
}