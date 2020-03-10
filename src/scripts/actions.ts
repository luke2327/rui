import { Message, GuildChannel } from 'discord.js';

export default {
  invalid: (message: Message): void => {
    message.channel.send('정확한 명령어를 입력 해 주세요');
  },

  help: (message: Message): void => {
    message.channel.send('메뉴얼');
  },

  ping: (message: Message): void => {
    message.channel.send('pong');
  },

  play: (message: Message): void => {
    message.channel.send('play');
  },

  skip: (message: Message): void => {
    message.channel.send('skip');
  },

  stop: (message: Message): void => {
    message.channel.send('stop');
  },

  avatar: (message: Message): void => {
    message.reply(message.author.displayAvatarURL());
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guildMemberAdd: (member: any): void => {
    const channel = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'member-log');

    if (!channel) return;

    channel.send(`Welcome to the server, ${member}`);
  }
}
