
import { Client, Intents } from '../build/index.js';

(async () => {
  const client = new Client('MTE1NzcyMDExNDMwMTUxNzkyNA.GyqSdV.H5bxTCTKBG6kJP-B0HUaSTVIVE7FhJsk-MR8VM', {
    // Set the required intents to receive message & guild related events.
    intents: [ Intents.GUILD, Intents.GUILD_MESSAGES, Intents.GUILD_MEMBERS, Intents.MESSAGE_CONTENT ],
    sharding: {
      // The total number of shards that will be initialized.
      totalShards: 4
    }
  });
  await client.init();

  // Subscribe to the "ready" event.
  // ready event will be fired when all shards are connected.
  client.events.ready.subscribe(() => {
    console.log(`I logged in as (${client.user?.username})`);
  });

  // Subscribe to the "shardReady" event.
  client.events.shardReady.subscribe((shard) => {
    console.log(`Shard connected: ${shard.id}`);
  });

  // Subscribe to the "messageCreate" event.
  client.events.messageCreate.subscribe(async (message) => {
    // Ignore the command if is exectued by a Bot.
    if(message.author.bot) return;

    if(message.content == '!ping') {
      // Send a message referencied by the author message.
      // client.shards.ping is an average of the ping of all connected shards, in this case a single shard.
      return await message.sendReference(`My ping is: \`${client.shards.ping}\`ms`);
    }
  });
})();

