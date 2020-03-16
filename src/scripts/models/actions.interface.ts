import { TextChannel, DMChannel, VoiceChannel, VoiceConnection } from 'discord.js';
import { Song } from './song.interface';

export interface QueueContract {
  textChannel: TextChannel | DMChannel,
  voiceChannel: VoiceChannel,
  connection: VoiceConnection | Partial<null>,
  songs: Array<Song>
  volume: number,
  playing: boolean
}
