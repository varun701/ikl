async function execute(message) {
  if (message.type == 'APPLICATION_COMMAND' && message.channel.id == '960123765583392788' && message.interaction.commandName == 'bump') {
    message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      VIEW_CHANNEL: false,
    })
    setTimeout(function() {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        VIEW_CHANNEL: true,
      })
    }, 7200000)
  }
}

export default {
  name: 'messageCreate',
  execute,
}