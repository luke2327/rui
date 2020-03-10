import { Client } from 'discord.js';
import { commonLogFileLocation } from './config/fileStream';
import { BOT_NAME, VERSION } from './config/settings';

import receiver from './scripts/receiver';
import log from './scripts/utils/logUtils';

/** create new Client object */
const client = new Client();

client.once('ready', () => {
  log.logger('info', commonLogFileLocation, `BOT_NAME => ${BOT_NAME} | VERSION => ${VERSION} | STATUS => ready`);
});

client.once('reconnecting', () => {
  log.logger('warn', commonLogFileLocation, `BOT_NAME => ${BOT_NAME} | VERSION => ${VERSION} | STATUS => reconnecting`);
});

client.once('disconnect', () => {
  log.logger('warn', commonLogFileLocation, `BOT_NAME => ${BOT_NAME} | VERSION => ${VERSION} | STATUS => disconnect`);
});

/** receive */
receiver.init(client);

client.login('');