/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Guild } from "./Guild";
import { TextChannel } from "./TextChannel";
import { User } from "./User";

export class Message {
  public id: string;
  public content: string;
  public author: User;
  public guild?: Guild;
  public channel?: TextChannel;

  public constructor(client: Client, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('Message(client): client is missing or invalid');
    if (!data || !data.id || !data.author) throw new Error('Message(data): data is missing or invalid');

    this.id = data.id;
    this.content = data.content;
    this.author = new User(client, data.author);
    this.guild = client.cache.guilds.get(data.guild_id) || undefined;

    if (this.guild) this.channel = this.guild.cache.channels.get<TextChannel>(data.channel_id) || undefined;
  }
}
