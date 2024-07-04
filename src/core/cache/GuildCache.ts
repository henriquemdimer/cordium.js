/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';
import { Collection } from '../classes/Collection';
import { Guild } from '../classes/Guild';

export class GuildCache extends Collection<Guild> {
  public constructor(client: Client, guilds?: any[]) {
    super();
    if (!client || !(client instanceof Client)) throw new Error('GuildManager(client): client is missing or invalid');

    if (guilds) {
      if (!Array.isArray(guilds)) guilds = [guilds];

      for (const _guild of guilds) {
        const guild = new Guild(client, _guild);
        super.set(guild.id, guild);
      }
    }
  }
}
