import { Message } from '../core/classes/Message';
import { ClusterManager } from '../core/cluster/ClusterManager';
import 'dotenv/config';
import ping from './commands/ping';
import { ClusterClient } from '../core/cluster/ClusterClient';
import evalCommand from './commands/eval';
import { Intents } from '../';

(async () => {
  const manager = new ClusterManager(process.env.TOKEN || '', {
    clustering: {
      totalWorkers: 2
    },
    sharding: {
      totalShards: 2,
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
        await ping(client, msg);
      } else if (msg.content.startsWith('!eval')) await evalCommand(client, msg);
    });

    client.on('error', (e) => console.log(e));

    client.init();
  });
})();
