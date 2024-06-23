/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../../core/Client";
import { Message } from "../../core/classes/Message";
import { ClusterClient } from "../../core/cluster/ClusterClient";

export default async (client: ClusterClient | Client, msg: Message) => {
  if (client instanceof ClusterClient) {
    const pings = await client.ipc.broadcast('client.shards.ping');
    let ping = 0;

    for (const Ping of pings.map((r: any) => r.data)) {
      ping += Ping;
    }

    ping = ping / pings.length;
    const shards = await client.ipc.broadcast('client.shards.size');

    await msg.channel?.send(`Ping: \`${ping}ms\` (Cluster ID=\`${client.workerId}\`/PID=\`${process.pid}\`)`)
    await msg.channel?.send(`Clusters: (\`${pings.length}\`)\n${pings.map((c: any) => `--> Cluster (\`${c.workerId}\`): \`${c.data}\`ms (Shards: ${shards.find((r: any) => r.workerId == c.workerId).data})`).join('\n')}`)
  } else {
    await msg.channel?.send(`Ping: \`${client.shards.ping}\`ms (PID = \`${process.pid}\`)`);
    await msg.channel?.send(`Shards: (\`${client.shards.size}\`)\n${Array.from(client.shards.values()).map((s) => `--> (ID = ${s.id}): \`${s.ping}\`ms`).join('\n')}`)
  }
}
