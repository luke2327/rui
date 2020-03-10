import { Client } from 'discord.js';
import receiver from './scripts/receiver';

/** create new Client object */
const client = new Client();

/** receive */
receiver.init(client);

client.login('');