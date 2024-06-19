/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { User } from "../classes/User";
import { Shard } from "../gateway/Shard";

export default (client: Client, shard: Shard, d: any) => {
  shard.ready = true;
  client.user = new User(client, d.user);

  client.emit('shardReady', shard);
  shard.emit('shardReady');
}
