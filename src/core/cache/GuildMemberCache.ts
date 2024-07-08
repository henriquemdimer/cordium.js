import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { Guild } from "../classes/Guild";
import { GuildMember } from "../classes/GuildMember";

export class GuildMemberCache extends Collection<GuildMember> {
	#client: Client;
	public guild: Guild;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public constructor(client: Client, guild: Guild, members?: any[]) {
		super();
		if (!client || !(client instanceof Client))
			throw new Error(
				"GuildMemberManager(client): client is missing or invalid.",
			);
		if (!guild || !(guild instanceof Guild))
			throw new Error("GuildMemberManager(guild): guild is missing or invalid");

		this.#client = client;
		this.guild = guild;
		if (members) {
			if (!Array.isArray(members)) members = [members];

			for (const Member of members) {
				const member = new GuildMember(client, guild, Member);
				this.set(member.user.id, member);
				client.cache.users.set(member.user.id, member.user);
			}
		}
	}

	public async fetch(guildId: string, memberId: string) {
		if (!guildId)
			throw new Error(
				"GuildMemberCache.fetch(guildId): guildId is required but is missing.",
			);
		if (!memberId)
			throw new Error(
				"GuildMemberCache.fetch(memberId): memberId is required but is missing.",
			);

		return new GuildMember(
			this.#client,
			this.guild,
			await this.#client.rest.request({
				method: "GET",
				endpoint: `/guilds/${guildId}/${memberId}`,
				auth: true,
			}),
		);
	}
}
