import { Client } from '../Client';
import { MessageCache } from '../cache/MessageCache';

export class TextChannelCacheManager {
  public messages: MessageCache;

  public constructor(client: Client) {
    if(!client || !(client instanceof Client)) throw new Error('TextChannelCache(client): client is missing or invalid.');

    this.messages = new MessageCache(client);
  }
}
