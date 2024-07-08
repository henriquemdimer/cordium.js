import { Client } from "../Client";
import { GuildCache } from "../cache/GuildCache";
import { UserCache } from "../cache/UserCache";

export class ClientCacheManager {
	public guilds: GuildCache;
	public users: UserCache;

	public constructor(client: Client) {
		if (!client || !(client instanceof Client))
			throw new Error("ClientCache(client): client is missing or invalid");

		this.guilds = new GuildCache(client);
		this.users = new UserCache(client);
	}
}
