import { QueueContract } from './actions.interface';

type EMPTY_QUEUE = Map<any, any>;
type FILLED_QUEUE = Map<string, QueueContract>;

export type QUEUE = EMPTY_QUEUE | FILLED_QUEUE;
