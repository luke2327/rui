 /* tslint:disable:no-unused-variable */
import { Client, Message, User, PartialGuildMember } from 'discord.js';
import { PREFIX } from '../config/settings';
import { USAGE_COMMANDS } from './models/commands.type';
import { actionLogFileLocation } from '../config/fileStream';

import actions from './actions';
import log from './utils/logUtils';

export default {
  init: (client: Client): void => {
    const queue = new Map();

    /** message */
    client.on('message', (message: Message) => {
      if (message.author.bot || !message.content.startsWith(PREFIX)) return;

      const serverQueue = message.guild ? queue.get(message.guild.id) : [];

      const msgContent = message.content as USAGE_COMMANDS;
      const msgAuthor = message.author as User;

      if (msgContent.startsWith(`${PREFIX}help`)) {
        actions.help(message);
      } else if (msgContent.startsWith(`${PREFIX}ping`)) {
        actions.ping(message);
      } else if (msgContent.startsWith(`${PREFIX}play`)) {
        actions.play(message, serverQueue, queue);
      } else if (msgContent.startsWith(`${PREFIX}search`)) {
        actions.search(message, serverQueue);
      } else if(msgContent.startsWith(`${PREFIX}queue`)) {
        actions.queue(message, serverQueue);
      } else if (msgContent.startsWith(`${PREFIX}skip`)) {
        actions.skip(message, serverQueue);
      } else if (msgContent.startsWith(`${PREFIX}pause`)) {
        actions.pause(message, serverQueue);
      } else if (msgContent.startsWith(`${PREFIX}resume`)) {
        actions.resume(message, serverQueue);
      } else if (msgContent.startsWith(`${PREFIX}stop`)) {
        actions.stop(message);
      } else if (msgContent.startsWith(`${PREFIX}avatar`)) {
        actions.avatar(message);
      } else if (msgContent.startsWith(`${PREFIX}녜힁`)) {
        actions.createNames(message);
      } else {
        actions.invalid(message);
      }

      /** logging */
      log.logger('debug', actionLogFileLocation,
        `[${msgAuthor}] => ${msgContent.startsWith('!') ? msgContent.substring(1) : msgContent} action is Successfully executed.`);
    });

    /** guild member add */
    client.on('guildMemberAdd', (member: PartialGuildMember) => {
      actions.guildMemberAdd(member);
    });
  }
}
