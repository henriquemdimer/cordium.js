import { Client } from '../Client';
import { GuildManager } from '../managers/GuildManager';
import { UserManager } from '../managers/UserManager';

export class ClientCache {
  public guilds: GuildManager;
  public users: UserManager;

  public constructor(client: Client) {
    if (!client || !(client instanceof Client)) throw new Error('ClientCache(client): client is missing or invalid');

    this.guilds = new GuildManager(client);
    this.users = new UserManager(client);
  }
}
