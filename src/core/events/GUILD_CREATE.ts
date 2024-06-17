/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Guild } from "../classes/Guild";
import { Shard } from "../gateway/Shard";

export default (client: Client, __: Shard, d: any) => {
  try {
    const guild = new Guild(client, d);
    client.cache.guilds.set(guild.id, guild);
  } catch (err) {
    console.log(err);
  }
}
