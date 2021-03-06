 /* tslint:disable:no-unused-variable */
import { Client, Message, User, PartialGuildMember } from 'discord.js';
import { USAGE_COMMANDS } from './models/commands.type';
import { QUEUE } from './models/actions.type';
import { QueueContract } from './models/actions.interface';
import { PREFIX } from '../config/settings';
import { actionLogFileLocation } from '../config/fileStream';

import actions from './actions';
import log from './utils/logUtils';

export default {
  init: (client: Client): void => {
    const queue: QUEUE = new Map();

    /** message */
    client.on('message', (message: Message) => {
      if (message.author.bot || !message.content.startsWith(PREFIX)) return;

      const serverQueue: QueueContract = message.guild ? queue.get(message.guild.id) : [];

      const msgContent = message.content as USAGE_COMMANDS;
      const msgAuthor = message.author as User;

      if (msgContent.startsWith(`${PREFIX}help`)) {
        actions.help(message).catch(e => { actions.errorHandling(message, e) });
      } else if (msgContent.startsWith(`${PREFIX}ping`)) {
        actions.ping(message).catch(e => { actions.errorHandling(message, e) });
      } else if (msgContent.startsWith(`${PREFIX}play`)) {
        actions.play(message, serverQueue, queue).catch(e => { actions.errorHandling(message, e) });
      } else if (msgContent.startsWith(`${PREFIX}search`)) {
        actions.search(message, serverQueue, queue).catch(e => { actions.errorHandling(message, e) });
      } else if(msgContent.startsWith(`${PREFIX}queue`)) {
        if (!serverQueue || !serverQueue.connection) {
          actions.undefinedConnection(message);
        } else {
          actions.queue(message, serverQueue.songs).catch(e => { actions.errorHandling(message, e) });
        }
      } else if (msgContent.startsWith(`${PREFIX}delete`)) {
        if (!serverQueue || !serverQueue.connection) {
          actions.undefinedConnection(message);
        } else {
          actions.delete(message, serverQueue.songs).catch(e => { actions.errorHandling(message, e) });
        }
      } else if (msgContent.startsWith(`${PREFIX}skip`)) {
        if (!serverQueue || !serverQueue.connection) {
          actions.undefinedConnection(message);
        } else {
          actions.skip(message, serverQueue.connection).catch(e => { actions.errorHandling(message, e) });
        }
      } else if (msgContent.startsWith(`${PREFIX}pause`)) {
        if (!serverQueue || !serverQueue.connection) {
          actions.undefinedConnection(message);
        } else {
          actions.pause(message, serverQueue.connection, queue).catch(e => { actions.errorHandling(message, e) });
        }
      } else if (msgContent.startsWith(`${PREFIX}resume`)) {
        if (!serverQueue || !serverQueue.connection) {
          actions.undefinedConnection(message);
        } else {
          actions.resume(message, serverQueue.connection, queue).catch(e => { actions.errorHandling(message, e) });
        }
      } else if (msgContent.startsWith(`${PREFIX}stop`)) {
        if (!serverQueue || !serverQueue.voiceChannel) {
          actions.undefinedConnection(message);
        } else {
          actions.stop(message, serverQueue.voiceChannel, queue).catch(e => { actions.errorHandling(message, e) });
        }
      } else if (msgContent.startsWith(`${PREFIX}avatar`)) {
        actions.avatar(message).catch(e => { actions.errorHandling(message, e) });
      } else if (msgContent.startsWith(`${PREFIX}녜힁`)) {
        actions.createNames(message).catch(e => { actions.errorHandling(message, e) });
      } else {
        actions.invalid(message).catch(e => { actions.errorHandling(message, e) });
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
