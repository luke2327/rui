import fs from 'fs';
import { LOGGER_LEVEL } from '../models/logger.type';
import { FILE_ENCODING } from '../../config/settings';
import commonUtil from './commonUtils';

const writeLogSync = (location: string, params: Error | string): void => {
  /** Error object handling */
  params = commonUtil.errToString(params);

  fs.appendFileSync(location, params, FILE_ENCODING);
}

export default {
  logger: async (level: LOGGER_LEVEL = 'info', location: string, ...messages: Array<string>): Promise<void> => {
    const logPrefix = `${new Date} [${__dirname}] ${level.toUpperCase()}: `;
    let logMsg = '';

    await Promise.all(messages.map((msg) => {
      logMsg = `${logPrefix}${msg}\n`;

      writeLogSync(location, logMsg);
    }));
  }
}
