import { Collection } from '../classes/Collection';
import { Message } from '../classes/Message';
import { Client } from '../Client';

export class MessageCache extends Collection<Message> {
  #client: Client;

  public constructor(client: Client) {
    super();

    if (!client || !(client instanceof Client)) throw new Error('MessageManager(client): client is missing or invalid.');
    this.#client = client;
  }

  public async fetch(channelId: string, messageId: string) {
    if (!channelId) throw new Error('MessageCache.fetch(channelId): channelId is required but is missing.');
    if (!messageId) throw new Error('MessageCache.fetch(messageId): messageId is required but is missing.');

    return new Message(this.#client, await this.#client.rest.request({ method: 'GET', endpoint: `/channels/${channelId}/${messageId}`, auth: true }));
  }
}
