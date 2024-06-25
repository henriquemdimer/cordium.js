import { Client, Intents } from '../';
import { Message } from '../core/classes/Message';
import 'dotenv/config';
import { Shard } from '../core/gateway/Shard';
import ping from './commands/ping';
import evalCommand from './commands/eval';

(async () => {
  const client = new Client(process.env.TOKEN || '', {
    intents: [
      Intents.ALL
    ],
    sharding: {
      totalShards: 1,
      connectOneShardAtTime: false,
    }
  });
  client.init();

  client.events.ready.subscribe(() => {
    console.log(`${client.user?.username} is ready.`);
  });

  client.events.shardReady.subscribe((shard) => {
    console.log(`Shard ready: ${shard.id}`);
  });

  client.events.messageCreate.subscribe(async (msg) => {
    if (msg.content?.startsWith('!ping')) await ping(client, msg);
    else if (msg.content?.startsWith('!eval')) evalCommand(client, msg);
  });
})();
