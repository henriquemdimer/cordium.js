import { Client, Intents } from "../";
import "dotenv/config";
import evalCommand from "./commands/eval";
import ping from "./commands/ping";

(async () => {
	const client = new Client(process.env.TOKEN || "", {
		intents: [Intents.ALL],
		sharding: {
			totalShards: 1,
			connectOneShardAtTime: false,
		},
	});
	await client.init();

	client.events.ready.subscribe(() => {
		console.log(`${client.user?.username} is ready.`);
	});

	client.events.shardReady.subscribe((shard) => {
		console.log(`Shard ready: ${shard.id}`);
	});

	client.events.messageCreate.subscribe(async (msg) => {
		if (msg.content?.startsWith("!ping")) await ping(client, msg);
		else if (msg.content?.startsWith("!eval")) evalCommand(client, msg);
	});
})();
