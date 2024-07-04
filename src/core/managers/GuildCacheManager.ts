/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';
import { Guild } from '../classes/Guild';
import { GuildChannelCache } from '../cache/GuildChannelCache';
import { GuildMemberCache } from '../cache/GuildMemberCache';

export class GuildCacheManager {
  public members: GuildMemberCache;
  public channels: GuildChannelCache;

  public constructor(client: Client, guild: Guild, rawData: any) {
    if (!client || !(client instanceof Client)) throw new Error('GuildCache(client): client is missing or invalid.');
    if (!guild || !(guild instanceof Guild)) throw new Error('GuildCache(guild): guild is missing or invalid');
    if (!rawData || !rawData.members) throw new Error('GuildCache(rawData): rawData is missing or invalid.');

    this.members = new GuildMemberCache(client, guild, rawData.members);
    this.channels = new GuildChannelCache(client, guild, rawData.channels);
  }
}
