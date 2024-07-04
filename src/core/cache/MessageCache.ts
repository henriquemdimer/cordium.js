import { Collection } from '../classes/Collection';
import { Message } from '../classes/Message';
import { Client } from '../Client';

export class MessageCache extends Collection<Message> {
  public constructor(client: Client) {
    super();

    if(!client || !(client instanceof Client)) throw new Error('MessageManager(client): client is missing or invalid.');
  }
}
