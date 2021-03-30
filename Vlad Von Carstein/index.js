const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true,
        partials: ['MESSAGE', 'REACTION']
    }),
    config = require('./config.json'),
    fs = require('fs'),
    humanizeDuration = require('humanize-duration'),
    cooldown = new Set()

client.login(config.token)
client.commands = new Discord.Collection()
client.db = require('./db.json')

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})


client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return

    if (message.guild) {
        if (!message.member.hasPermission('MANAGE_CHANNELS') && client.db.lockedChannels.includes(message.channel.id)) return message.delete()

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            const duration = config.cooldown[message.channel.id]
            if (duration) {
                const id = `${message.channel.id}_${message.author.id}`
                if (cooldown.has(id)) {
                    message.delete()
                    return message.channel.send(`Ce salon est soumis a un cooldown de ${humanizeDuration(duration, { language: 'fr' })}.`).then(sent => sent.delete({ timeout: 5e3 }))
                }
                cooldown.add(id)
                setTimeout(() => cooldown.delete(id), duration)
            }
        }
    }

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisée que dans un serveur.')
    command.run(message, args, client)
})

// Quand on créer un nouveau salon, se créer avec le role mute
client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted 🤐')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false,
    })
})

// Quand le bot se lance correctement renvoie dans le terminal "Samuraï opérationnel ! et définie sont statue"
client.on('ready', () => {
    setInterval(() => {
        const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
        client.channels.cache.get(config.serverStats.humans).setName(`Membres : ${humans.size}`)
        client.channels.cache.get(config.serverStats.bots).setName(`Bots : ${bots.size}`)
        client.channels.cache.get(config.serverStats.total).setName(`Total : ${client.guilds.cache.first().memberCount}`)
    }, 6e4)

    const statuses = [
        // () => `${client.guilds.cache.size} serveur`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, -1)} utilisateurs`,
        () => `la commande !help`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), { type: 'WATCHING' })
        i = ++i % statuses.length
    }, 1e4)
    console.log("Vlad Von Carstein se réveille !");
})


// Quand un membre rejoint le serveur
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member} Un humain est apparue ${member.guild.memberCount} ! 🎉`)
    member.roles.add(config.greeting.roles)
})

// Quand un membre quite le serveur
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} à quitté le serveur... 😢`)
})

client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji.type == "règlement") reaction.message.guild.member(user).roles.add(emoji.roles) && reaction.message.guild.member(user).roles.remove('824233886204035133')
    else if (emoji) reaction.message.guild.member(user).roles.add(emoji.roles) && console.log(Date(), `${user.tag} à cliqué sur la réaction ${emoji.type}`)
    else reaction.users.remove(user)
})

client.on('messageReactionRemove', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem || !reactionRoleElem.removable) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.remove(emoji.roles) && console.log(Date(), `${user.tag} à retiré ça réaction ${emoji.type}`)
})