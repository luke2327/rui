import { TextChannel, DMChannel, VoiceChannel } from 'discord.js';

export interface QueueContract {
  textChannel: TextChannel | DMChannel,
  voiceChannel: VoiceChannel,
  connection: null,
  songs: Array<Record<string, string>>
  volume: number,
  playing: boolean
}