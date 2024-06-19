import { Client, Intents } from '../';
import { Message } from '../core/classes/Message';
import 'dotenv/config';
import { Shard } from '../core/gateway/Shard';

(async () => {
  const client = new Client(process.env.TOKEN || '', {
    intents: [
      Intents.ALL
    ],
    sharding: {
      totalShards: 5,
      connectOneShardAtTime: false
    }
  });
  client.init();

  client.on('ready', () => {
    console.log(`${client.user?.username} is ready.`);
  });

  client.on('shardReady', (shard: Shard) => {
    console.log(`Shard ready: ${shard.id}`);
  })

  client.on('messageCreate', async (msg: Message) => {
    if (msg.content.startsWith('!')) {
      await msg.channel?.send(`ping: ${client.shards.ping}ms`);
      await msg.channel?.send(`shards: ${client.shards.size}`);
    }
  });
})();
