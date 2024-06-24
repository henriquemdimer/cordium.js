/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';
import { Guild } from './Guild';
import { TextChannel } from './TextChannel';
import { User } from './User';

export class Message {
  #client: Client;
  public id: string;
  public content: string | null;
  public author: User;
  public guildId: string;
  public channelId: string;

  public constructor(client: Client, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('Message(client): client is missing or invalid');
    if (!data || !data.id || !data.author) throw new Error('Message(data): data is missing or invalid');

    this.#client = client;
    this.id = data.id;
    this.content = data.content || null;
    this.author = new User(client, data.author);
    this.guildId = data.guild_id;
    this.channelId = data.channel_id;
  }

  get guild(): Guild | null {
    return this.#client.cache.guilds.get(this.guildId); 
  }

  get channel(): TextChannel | null {
    return this.guild?.cache.channels.get(this.channelId) || null;
  }
}
