/* eslint-disable @typescript-eslint/no-unused-vars */
import Discord from 'discord.js';
import receiver from './scripts/receiver';
import log from './scripts/utils/logUtils';
// import ytdl from 'ytdl-core';

import { commonLogFileLocation } from './config/fileStream';
import { BOT_NAME, VERSION } from './config/settings';

/** create new Client object */
const client = new Discord.Client();

/** get token */
const TOKEN = process.env.TOKEN;


client.once('ready', () => {
  log.logger('info', commonLogFileLocation, `BOT_NAME => ${BOT_NAME} | VERSION => ${VERSION} | STATUS => ready`);
});

client.once('reconnecting', () => {
  log.logger('warn', commonLogFileLocation, `BOT_NAME => ${BOT_NAME} | VERSION => ${VERSION} | STATUS => reconnecting`);
});

client.once('disconnect', () => {
  log.logger('warn', commonLogFileLocation, `BOT_NAME => ${BOT_NAME} | VERSION => ${VERSION} | STATUS => disconnect`);
});

/** login */
client.login(TOKEN);

/** receive */
receiver.init(client);