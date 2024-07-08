import { Client } from "../Client";
import type { Guild } from "./Guild";

export class GuildChannel {
	public id: string;
	public name: string;
	public type: number;
	public nsfw: boolean;
	public position: number;
	public topic?: string | null;
	public guild: Guild;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public constructor(client: Client, guild: Guild, data: any) {
		if (!client || !(client instanceof Client))
			throw new Error("GuildChannel(client): client is missing or invalid");
		if (!data || !data.id || !data.name || data.type === undefined)
			throw new Error("GuildChannel(data): data is missing or invalid");

		this.id = data.id;
		this.name = data.name;
		this.type = data.type;
		this.nsfw = data.nsfw || false;
		this.position = data.position;
		this.topic = data.topic || null;
		this.guild = guild;
	}
}
