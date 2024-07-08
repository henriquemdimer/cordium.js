import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { User } from "../classes/User";

export class UserCache extends Collection<User> {
	#client: Client;

	public constructor(client: Client, users?: User[]) {
		super();

		if (!client || !(client instanceof Client))
			throw new Error("UserManager(client): client is missing or invalid");

		this.#client = client;
		if (users) {
			if (!Array.isArray(users)) users = [users];

			for (const _user of users) {
				const user = new User(client, _user);
				super.set(user.id, user);
			}
		}
	}

	public async fetch(id: string) {
		if (!id)
			throw new Error("UserCache.fetch(id): id is required but is missing.");

		return new User(
			this.#client,
			await this.#client.rest.request({
				method: "GET",
				endpoint: `/users/${id}`,
				auth: true,
			}),
		);
	}
}
