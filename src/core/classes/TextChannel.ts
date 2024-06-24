/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextChannelCache } from '../cache/TextChannelCache';
import { Client } from '../Client';
import { Guild } from './Guild';
import { GuildChannel } from './GuildChannel';
import { Message } from './Message';

export class TextChannel extends GuildChannel {
  public lastMessageId?: string;
  public cache: TextChannelCache;
  #client: Client;

  public constructor(client: Client, guild: Guild, data: any) {
    super(client, guild, data);

    this.#client = client;
    this.cache = new TextChannelCache(client);
    this.lastMessageId = data.lastMessageId;
  }

  public async send(content: string) {
    const res = await this.#client.rest.request({
      method: 'post',
      endpoint: `/channels/${this.id}/messages`,
      body: {
        content
      },
      auth: true
    });

    return new Message(this.#client, res);
  }
}
