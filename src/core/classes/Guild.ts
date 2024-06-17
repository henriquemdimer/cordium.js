/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { GuildCache } from "../cache/GuildCache";

export class Guild {
  public id: string;
  public name: string;
  public cache: GuildCache;
  public icon?: string;
  public iconHash?: string;
  public splash?: string;
  public discoverySplash?: string;
  public ownerId: string;
  public region?: string;

  public constructor(client: Client, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('Guild(client): client is missing or invalid.');
    if (!data || !data.id || !data.name || !data.owner_id) throw new Error('Guild(data): data is missing or invalid.');

    this.id = data.id;
    this.name = data.name;
    this.cache = new GuildCache(client, this, data);
    this.icon = data.icon;
    this.iconHash = data.icon_hash;
    this.discoverySplash = data.discovery_splash;
    this.ownerId = data.owner_id;
    this.region = data.region;
  }
}
