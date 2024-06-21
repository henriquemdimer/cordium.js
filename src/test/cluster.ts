import { Client } from "../core/Client";
import { Message } from "../core/classes/Message";
import { ClusterManager } from "../core/cluster/ClusterManager";
import 'dotenv/config';
import ping from "./commands/ping";
import { Intents } from "../core/constants/Intents";
import { IPCMessage } from "../core/classes/IPCMessage";
import { ClusterClient } from "../core/cluster/ClusterClient";

(async () => {
  const manager = new ClusterManager(process.env.TOKEN || "", {
    clustering: {
      totalWorkers: 2
    },
    sharding: {
      totalShards: 10,
      connectOneShardAtTime: false
    },
    intents: [Intents.ALL]
  });

  (await manager.init()).on('workerSpawned', (client: ClusterClient) => {
    console.log('workerSpawned', process.pid);
    client.on('ready', () => {
      console.log(client.user?.username, 'is ready', 'PID =', process.pid);
    });

    client.on('messageCreate', async (msg: Message) => {
      if (msg.content.startsWith('!ping')) {
        ping(client, msg);
      }
    });

    client.on('error', (e) => console.log(e));

    client.init();
  })
})();
