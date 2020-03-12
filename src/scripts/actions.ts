import { Message, GuildChannel } from 'discord.js';
import { QueueContract } from './models/actions.interface';
import ytdl from 'ytdl-core';

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

  play: async (message: Message, serverQueue: any, queue: Map<any, any>): Promise<any> => {
    const args = message.content.split(' ');
    const voiceChannel = message.member ? message.member.voice.channel : null;

    if (!voiceChannel) return;

    const clientUser = message.client ? message.client.user : null;

    if (!clientUser) return;

    const permissions = voiceChannel ? voiceChannel.permissionsFor(clientUser) : null;

    if (!permissions) return;

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return;

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };

    if (!serverQueue && message.guild) {
      const queueContract: QueueContract = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      queueContract.songs.push(song);

      try {
        const connection = await voiceChannel.join();

        queueContract.connection = connection as any;

        queue.set(message.guild.id, queueContract);

        playSong(message.guild, queueContract.songs[0], queue);
      } catch (err) {
        message.channel.send(err.toString());

        queue.delete(message.guild.id);

        return;
      }
    } else {
      serverQueue.songs.push(song);

      message.channel.send(`${song.title} has been added to the queue!`);

      // return message.channel.send(serverQueue);
    }
  },

  skip: (message: Message, serverQueue: any): any => {
    if (message.member && message.member.voice && !message.member.voice.channel) {
      return message.channel.send('You have to be in a voice channel to stop the music!');
    }
    if (!serverQueue) {
      return message.channel.send('There is no song that I could skip!');
    }

    message.channel.send('successfully skip!');

    try {
      serverQueue.connection.dispatcher.end();
    } catch (err) {
      message.channel.send(err.toString());
    }
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

const playSong = async (guild: any, song: any, queue: Map<any, any>): Promise<void> => {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);

    return;
  }

  await serverQueue.connection.play(ytdl(song.url), { volume: 0.5 }).on('end', () => {
      console.log('music end');
      serverQueue.songs.shift();

      playSong(guild, serverQueue.songs[0], queue);
    }).on('error', (error: Error) => {
      console.log(error);
    });

  /** 아래 코드 추가하면 왠지 모르겠는데 소리가 안들림 */
  // dispatcher.setVolumeLogarithmic(serverQueue / 5);
}