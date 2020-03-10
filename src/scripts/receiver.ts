import { Client, Message, PartialGuildMember } from 'discord.js';
import { PREFIX } from '../config/settings';
import { actionLogFileLocation } from '../config/settings';
import actions from './actions';
import log from './utils/logUtils';

export default {
  init: (client: Client): void => {
    client.on('ready', () => {
      console.log('ready...');
      console.log(client.user);
    });

    /** message */
    client.on('message', (message: Message) => {
      const msgContent = message.content;
      const msgAuthor = message.author;

      if (msgContent === `${PREFIX}ping`) {
        actions.ping(message);
      } else if (msgContent === `${PREFIX}avatar`) {
        actions.avatar(message);
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
