import { Client, Message, PartialGuildMember } from 'discord.js';
import { PREFIX } from '../config/settings';
import { actionLogFileLocation } from '../config/fileStream';

import actions from './actions';
import log from './utils/logUtils';

export default {
  init: (client: Client): void => {
    /** message */
    client.on('message', (message: Message) => {
      const msgContent = message.content;
      const msgAuthor = message.author;

      if (msgContent.startsWith(`${PREFIX}help`)) {
        actions.help(message);
      } else if (msgContent.startsWith(`${PREFIX}ping`)) {
        actions.ping(message);
      } else if (msgContent.startsWith(`${PREFIX}play`)) {
        actions.play(message);
      } else if (msgContent.startsWith(`${PREFIX}skip`)) {
        actions.skip(message);
      } else if (msgContent.startsWith(`${PREFIX}stop`)) {
        actions.stop(message);
      } else if (msgContent.startsWith(`${PREFIX}avatar`)) {
        actions.avatar(message);
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
