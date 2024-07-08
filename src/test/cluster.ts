import { ClusterManager } from "../core/cluster/ClusterManager";
import "dotenv/config";
import { Intents } from "../";
import type { ClusterClient } from "../core/cluster/ClusterClient";
import evalCommand from "./commands/eval";
import ping from "./commands/ping";

(async () => {
	const manager = new ClusterManager(process.env.TOKEN || "", {
		clustering: {
			totalWorkers: 2,
		},
		sharding: {
			totalShards: 2,
			connectOneShardAtTime: false,
		},
		intents: [Intents.ALL],
	});

	await manager.init();
	manager.events.workerSpawned.subscribe((client: ClusterClient) => {
		client.events.ready.subscribe(() => {
			console.log(client.user?.username, "is ready", "PID =", process.pid);
		});

		client.events.messageCreate.subscribe(async (msg) => {
			if (msg.content?.startsWith("!ping")) {
				await ping(client, msg);
			} else if (msg.content?.startsWith("!eval"))
				await evalCommand(client, msg);
		});

		client.init();
	});
})();
