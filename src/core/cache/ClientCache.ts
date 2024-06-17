import { Client } from "../Client";
import { GuildManager } from "../managers/GuildManager";

export class ClientCache {
  public guilds: GuildManager;

  public constructor(client: Client) {
    if (!client || !(client instanceof Client)) throw new Error('ClientCache(client): client is missing or invalid');

    this.guilds = new GuildManager(client);
  }
}
