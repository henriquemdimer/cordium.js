import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { Guild } from "../classes/Guild";

export class GuildCache extends Collection<Guild> {
	#client: Client;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public constructor(client: Client, guilds?: any[]) {
		super();
		if (!client || !(client instanceof Client))
			throw new Error("GuildManager(client): client is missing or invalid");

		this.#client = client;
		if (guilds) {
			if (!Array.isArray(guilds)) guilds = [guilds];

			for (const _guild of guilds) {
				const guild = new Guild(client, _guild);
				super.set(guild.id, guild);
			}
		}
	}

	public async fetch(id: string) {
		if (!id)
			throw new Error("GuildCache.fetch(id): id is required but is missing.");
		return new Guild(
			this.#client,
			await this.#client.rest.request({
				method: "GET",
				endpoint: `/guilds/${id}`,
				auth: true,
			}),
		);
	}
}
