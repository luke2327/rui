import { TextChannel, DMChannel, VoiceChannel } from 'discord.js';
import { Song } from './song.interface';

export interface QueueContract {
  textChannel: TextChannel | DMChannel,
  voiceChannel: VoiceChannel,
  connection: null,
  songs: Array<Song>
  volume: number,
  playing: boolean
}