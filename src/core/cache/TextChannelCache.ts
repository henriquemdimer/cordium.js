import { Client } from '../Client';
import { MessageManager } from '../managers/MessageManager';

export class TextChannelCache {
  public messages: MessageManager;

  public constructor(client: Client) {
    if(!client || !(client instanceof Client)) throw new Error('TextChannelCache(client): client is missing or invalid.');

    this.messages = new MessageManager(client);
  }
}
