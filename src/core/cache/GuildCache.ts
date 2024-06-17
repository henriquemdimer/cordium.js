/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Guild } from "../classes/Guild";
import { GuildChannelManager } from "../managers/GuildChannelManager";
import { GuildMemberManager } from "../managers/GuildMemberManager";

export class GuildCache {
  public members: GuildMemberManager;
  public channels: GuildChannelManager;

  public constructor(client: Client, guild: Guild, rawData: any) {
    if (!client || !(client instanceof Client)) throw new Error('GuildCache(client): client is missing or invalid.');
    if (!guild || !(guild instanceof Guild)) throw new Error('GuildCache(guild): guild is missing or invalid');
    if (!rawData || !rawData.members) throw new Error('GuildCache(rawData): rawData is missing or invalid.');

    this.members = new GuildMemberManager(client, guild, rawData.members);
    this.channels = new GuildChannelManager(client, guild, rawData.channels);
  }
}
