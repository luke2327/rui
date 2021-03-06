import { Message, GuildChannel, VoiceConnection, Guild, StreamDispatcher, VoiceChannel, ClientUser, Permissions } from 'discord.js';
import { QueueContract } from './models/actions.interface';
import { QUEUE } from './models/actions.type';
import { Song } from './models/song.interface';
import { names } from './utils/names';

import yt   from './utils/yt';
import log  from './utils/logUtils';
import ytdl from 'ytdl-core';
import commonUtils from './utils/commonUtils';
import { actionLogFileLocation } from '../config/fileStream';

export default {
  errorHandling: (message: Message, e: Error | string): void => {
    const msg = commonUtils.errToString(e);

    message.reply(msg);
    log.logger('error', actionLogFileLocation, `[${message.author}] => ${msg}`);
  },

  invalid: async (message: Message): Promise<Error | void> => {
    message.channel.send('정확한 명령어를 입력해 주세요');
  },

  help: async (message: Message): Promise<Error | void> => {
    message.channel.send(`
\`[commands] => (parameters)\`

**MUSIC**
**[1]** \`play => youtube url\`
**[2]** \`search => search word\`
**[3]** \`delete => queue number\`
**[4]** \`stop\`
**[5]** \`skip\`
**[6]** \`queue\`
**[7]** \`pause\`
**[8]** \`resume\`

**UTILS**
**[1]** \`ping\`
**[2]** \`녜힁 => number\`
    `);
  },

  ping: async (message: Message): Promise<Error | void> => {
    message.channel.send('Pinging ...').then(msg => {
      msg.edit(`Ping: ${Date.now() - msg.createdTimestamp}`);
    });
  },

  play: async (message: Message, serverQueue: QueueContract, queue: QUEUE): Promise<Error | void> => {
    const searchKey = message.content.split(' ')[1];
    const preference = getPreference(message);
    const voiceChannel = preference.voiceChannel;
    const songInfo: ytdl.videoInfo = await ytdl.getInfo(searchKey);
    const song: Song = {
      title: songInfo.title,
      url: songInfo.video_url
    };

    playStream(message, voiceChannel, serverQueue, queue, song);
  },

  search: async (message: Message, serverQueue: QueueContract, queue: QUEUE): Promise<Error | void> => {
    const searchKey = message.toString().split('!search')[1],
          searchLimit = 10;

    if (!searchKey) {
      message.channel.send('Please enter a word to search for');

      return;
    }

    message.reply(`search... ${searchKey}`);

    const searchResults = await yt.searchVideo(searchKey, searchLimit);
    const sliceResults = searchResults.slice(0, searchLimit);
    let respMsg = '';

    for (let i in sliceResults) {
      respMsg += `**[${parseInt(i) + 1}]** \`${sliceResults[i].snippet.title}\`\n`;
    }

    /** Then add some more text info instructions */
    respMsg += `\n**Choose a number between** \`1-${sliceResults.length}\`\n`;

    /** send output */
    const searchMsg = message.channel.send(respMsg);

    /** make message collector */
    const filter = (msg: Message) => !isNaN(parseInt(msg.content)) && parseInt(msg.content) < sliceResults.length + 1 && parseInt(msg.content) > 0;
    const collector = message.channel.createMessageCollector(filter);

    collector.once('collect', async (msg) => {
      const preference = getPreference(message);
      const voiceChannel = preference.voiceChannel;
      const songInfo = sliceResults[parseInt(msg.content) - 1];
      const song: Song = {
        title: songInfo.snippet.title,
        url: 'https://www.youtube.com/watch?v=' + songInfo.id.videoId
      };

      message.channel.send(song.url);

      searchMsg.then(searchMsg => {
        searchMsg.delete();
      });

      playStream(message, voiceChannel, serverQueue, queue, song);
    });
  },

  queue: async (message: Message, songs: Array<Song>): Promise<Error | void> => {
    if (!songs.length) {
      message.channel.send('There are no stacked song queues');

      return;
    }

    message.channel.send(`\`Staked queues\n ${songs.map((v: Song, i: number) => `${i + 1} : ${v.title} \n`).join(' ')}\``);
  },

  delete: async (message: Message, songs: Array<Song>): Promise<Error | void> => {
    if (!songs.length) {
      message.channel.send('There are no stacked song queues');

      return;
    }

    const songIdx = parseInt(message.toString().split(' ')[1]) - 1;

    /** 현재 재생중인 노래는 삭제 안되도록 */
    if (songIdx === 0) {
      message.channel.send('This song is currently playing. Skip it to get rid of it');

      return;
    }

    message.channel.send(`\`${songs[songIdx].title}\` is successfully deleted`);

    delete songs[songIdx];
  },

  skip: async (message: Message, connection: VoiceConnection): Promise<Error | void> => {
    if (message.member && message.member.voice && !message.member.voice.channel) {
      message.channel.send('You have to be in a voice channel to stop the music!');

      return;
    }

    connection.dispatcher.end();
    message.channel.send('\`successfully skip\`');
  },

  pause: async (message: Message, connection: VoiceConnection, queue: QUEUE): Promise<Error | void> => {
    connection.dispatcher.pause();

    message.channel.send(`\`Pause | ${message.guild && message.guild.id ? queue.get(message.guild.id).songs[0].title : ''}\``);
  },

  resume: async (message: Message, connection: VoiceConnection, queue: QUEUE): Promise<Error | void> => {
    connection.dispatcher.resume();

    message.channel.send(`\`Resume | ${message.guild && message.guild.id ? queue.get(message.guild.id).songs[0].title : ''}\``);
  },

  stop: async (message: Message, voiceChannel: VoiceChannel, queue: QUEUE): Promise<Error | void> => {
    message.channel.send('Stop | leave channel');
    voiceChannel.leave();

    if (message.guild && message.guild.id) {
      queue.delete(message.guild.id);
    }
  },

  avatar: async (message: Message): Promise<Error | void> => {
    message.reply(message.author.displayAvatarURL());
  },

  createNames: async (message: Message): Promise<Error | void> => {
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
  guildMemberAdd: async (member: any): Promise<Error | void> => {
    const channel = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'member-log');

    if (!channel) return;

    channel.send(`Welcome to the server, ${member}`);
  },

  undefinedConnection: async (message: Message): Promise<Error | void> => {
    message.channel.send('Invalid command syntax');

    return;
  }
}

const playSong = async (message: Message, guild: Guild, song: Song, queue: QUEUE): Promise<Error | void> => {
  const serverQueue = queue.get(guild.id) as QueueContract;

  if (!serverQueue.connection) return;

  const dispatcher: StreamDispatcher = serverQueue.connection.play(ytdl(song.url), { volume: 0.5 });

  dispatcher.on('finish', () => {
    serverQueue.songs.shift();

    const currentSong = serverQueue.songs[0];

    if (currentSong) {
      message.channel.send(`\`Next | ${currentSong.title}\``);
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

    log.logger('error', actionLogFileLocation, errMsg);
  });
}

const getVoiceChannel = (message: Message): VoiceChannel | null => {
  return message.member ? message.member.voice.channel : null;
}

const getClientUser = (message: Message): ClientUser | null => {
  return message.client ? message.client.user : null;
}

const getPermissions = (voiceChannel: VoiceChannel, clientUser: ClientUser): Readonly<Permissions> | null => {
  return voiceChannel ? voiceChannel.permissionsFor(clientUser) : null;
}

interface Preference {
  voiceChannel: VoiceChannel;
  clientUser: ClientUser;
  permissions: Readonly<Permissions>;
}

const getPreference = (message: Message): Preference => {
  const voiceChannel = getVoiceChannel(message);
  if (!voiceChannel) {
    message.reply('You need to join a voice channel first');

    throw new Error ('failed get preference');
  }

  const clientUser = getClientUser(message);
  if (!clientUser) throw new Error ('failed get preference');

  const permissions = getPermissions(voiceChannel, clientUser);
  if (!permissions || !permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    throw new Error ('Importing permissions fails, or you do not have them')
  };

  const preference = {
    voiceChannel, clientUser, permissions
  };

  return preference;
}

const getConnection = async (voiceChannel: VoiceChannel): Promise<VoiceConnection> => {
  return await voiceChannel.join();
}

const getQueueContract = async (message: Message, voiceChannel: VoiceChannel, song: Song): Promise<QueueContract> => {
  const queueContract: QueueContract = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true
  };

  queueContract.songs.push(song);
  queueContract.connection = await getConnection(voiceChannel) as VoiceConnection;

  return queueContract;
}

const playStream = async (message: Message, voiceChannel: VoiceChannel, serverQueue: QueueContract, queue: QUEUE, song: Song): Promise<Error | void> => {
  if (!serverQueue && message.guild) {
    const queueContract = await getQueueContract(message, voiceChannel, song);
    const firstSong = queueContract.songs[0];

    queue.set(message.guild.id, queueContract);
    message.channel.send(`\`Play | ${song.title}\``);

    playSong(message, message.guild as Guild, firstSong, queue as QUEUE);
  } else {
    serverQueue.songs.push(song);
    message.channel.send(`${song.title}\n\`has been added to the queues\``);
  }
};