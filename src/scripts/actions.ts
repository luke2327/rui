import { Message, GuildChannel } from 'discord.js';

export default {
  ping: (message: Message): void => {
    message.channel.send('pong');
  },

  avatar: (message: Message): void => {
    message.reply(message.author.displayAvatarURL());
  },

  guildMemberAdd: (member: any): void => {
    const channel = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'member-log');

    if (!channel) return;

    channel.send(`Welcome to the server, ${member}`);
  }
}
