/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';
import { GuildCacheManager } from '../managers/GuildCacheManager';

export class Guild {
  public id: string;
  public name: string;
  public cache: GuildCacheManager;
  public icon: string | null;
  public iconHash: string | null;
  public splash: string | null;
  public discoverySplash: string | null;
  public ownerId: string;
  public region: string | null;

  public constructor(client: Client, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('Guild(client): client is missing or invalid.');
    if (!data || !data.id || !data.name || !data.owner_id) throw new Error('Guild(data): data is missing or invalid.');

    this.id = data.id;
    this.name = data.name;
    this.cache = new GuildCacheManager(client, this, data);
    this.icon = data.icon || null;
    this.iconHash = data.icon_hash || null;
    this.discoverySplash = data.discovery_splash || null;
    this.splash = data.splash || null;
    this.ownerId = data.owner_id;
    this.region = data.region || null;
  }
}
