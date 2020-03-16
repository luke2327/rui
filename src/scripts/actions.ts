import { Message, GuildChannel, VoiceConnection, Guild } from 'discord.js';
import { QueueContract } from './models/actions.interface';
import { Song } from './models/song.interface';
import { names } from './utils/names';

import yt   from './utils/yt';
import log  from './utils/logUtils';
import ytdl from 'ytdl-core';
import ping from 'ping';

export default {
  invalid: (message: Message): void => {
    message.channel.send('정확한 명령어를 입력해 주세요');
  },

  help: (message: Message): void => {
    message.channel.send('메뉴얼');
  },

  ping: (message: Message): void => {
    const hosts = ['google.com', 'yahoo.com'];

    hosts.forEach((host) => {
      ping.promise.probe(host).then((re) => {
        message.channel.send(`\`HOST: ${re.host}, STATUS: ${re.alive}, TIME: ${re.time}\``);
      });
    });
  },

  play: async (message: Message, serverQueue: any, queue: Map<any, any>): Promise<void> => {
    const args = message.content.split(' ');
    const voiceChannel = message.member ? message.member.voice.channel : null;

    if (!voiceChannel) {
      message.reply('You need to join a voice channel first');

      return;
    };

    const clientUser = message.client ? message.client.user : null;

    if (!clientUser) return;

    const permissions = voiceChannel ? voiceChannel.permissionsFor(clientUser) : null;

    if (!permissions) return;

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return;

    const songInfo: ytdl.videoInfo = await ytdl.getInfo(args[1]);
    const song: Song = {
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
        const connection: VoiceConnection = await voiceChannel.join();

        queueContract.connection = connection as any;

        queue.set(message.guild.id, queueContract);
        message.channel.send(`\`Playing\` ${song.title}`);

        playSong(message, message.guild as Guild, queueContract.songs[0], queue);
      } catch (err) {
        const errMsg = `An error has occurred. ${err.toString()}`;

        queue.delete(message.guild.id);
        message.channel.send(errMsg);

        log.logger('error', errMsg);

        return;
      }
    } else {
      serverQueue.songs.push(song);

      message.channel.send(`${song.title} has been added to the queues!`);
    }
  },

  search: (message: Message, serverQueue: any): void => {
    const searchKey = message.toString().split(' ')[1];

    if (!searchKey) {
      message.channel.send('Please enter a word to search for');

      return;
    }

    yt.searchVideo(searchKey);
  },

  queue: (message: Message, serverQueue: any): void => {
    if (!serverQueue || !serverQueue.songs) {
      message.channel.send('There are no stacked song queues');
    } else {
      message.channel.send(`\`Staked queues \n ${serverQueue.songs.map((v: Song, i: number) => `${i + 1} : ${v.title} \n`).join(' ')}\``);
    }
  },

  skip: (message: Message, serverQueue: any): void => {
    if (message.member && message.member.voice && !message.member.voice.channel) {
      message.channel.send('You have to be in a voice channel to stop the music!');
    }
    if (!serverQueue) {
      message.channel.send('There is no song that I could skip!');
    }

    try {
      serverQueue.connection.dispatcher.end();
      message.channel.send('successfully skip!');
    } catch (err) {
      message.channel.send(err.toString());
    }
  },

  pause: (message: Message, serverQueue: any): void => {
    serverQueue.connection.dispatcher.pause();

    message.channel.send('\`pause song\`');
  },

  resume: (message: Message, serverQueue: any): void => {
    serverQueue.connection.dispatcher.resume();

    message.channel.send('\`resume song\`');
  },

  stop: (message: Message): void => {
    message.channel.send('stop');
  },

  avatar: (message: Message): void => {
    message.reply(message.author.displayAvatarURL());
  },

  createNames: (message: Message): void => {
    let name = '';
    const commandString = message.toString();
    const nameLength = parseInt(
      commandString.includes(' ')
        ? commandString.split(' ')[1]
        : commandString.split('녜힁')[1]
    );

    console.log(nameLength, typeof nameLength);

    if (Number.isNaN(nameLength)) {
      message.reply('녜힁 뒤에 길이를 입력해 주세요');
    } else {
      for (let i = 0; i < nameLength; i++) {
        name += names[Math.floor(Math.random() * 2350)];
      }

      message.reply(name);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guildMemberAdd: (member: any): void => {
    const channel = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'member-log');

    if (!channel) return;

    channel.send(`Welcome to the server, ${member}`);
  }
}

const playSong = async (message: Message, guild: Guild, song: Song, queue: Map<any, any>): Promise<void> => {
  const serverQueue = queue.get(guild.id);
  const dispatcher = serverQueue.connection.play(ytdl(song.url), { volume: 0.5 });

  dispatcher.on('finish', () => {
    serverQueue.songs.shift();

    const currentSong = serverQueue.songs[0];

    if (currentSong) {
      message.channel.send(`\`Next\` ${currentSong.title}`);
    } else {
      serverQueue.voiceChannel.leave();

      queue.delete(guild.id);

      message.channel.send('All over Music queue');

      return;
    }

    playSong(message, guild, serverQueue.songs[0], queue);
  });

  dispatcher.on('error', (err: Error) => {
    const errMsg = `An error has occurred. ${err.toString()}`;

    message.channel.send(errMsg);

    log.logger('error', errMsg);
  });
}