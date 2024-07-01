/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../../core/Client';
import { Message } from '../../core/classes/Message';
import { ClusterClient } from '../../core/cluster/ClusterClient';

export default async (client: ClusterClient | Client, msg: Message) => {
  if (client instanceof ClusterClient) {
    const pings = await client.ipc.broadcast('client.shards.ping');
    let ping = pings.map((d) => d.content as number).reduce((acc, cur) => acc + cur, 0);

    ping = ping / pings.length;
    const shards = await client.ipc.broadcast('client.shards.size');

    await msg.sendReference(`Ping: \`${ping}ms\` (Cluster ID=\`${client.workerId}\`/PID=\`${process.pid}\`)\nClusters: (\`${pings.length}\`)\n${pings.map((c: any) => `--> Cluster (\`${c.workerId}\`): \`${c.content}\`ms (Shards: ${shards.find((r: any) => r.workerId == c.workerId)?.content})`).join('\n')}`);
  } else {
    await msg.sendReference(`Ping: \`${client.shards.ping}\`ms (PID = \`${process.pid}\`)\nShards: (\`${client.shards.size}\`)\n${Array.from(client.shards.values()).map((s) => `--> (ID = ${s.id}): \`${s.ping}\`ms`).join('\n')}`);
  }
};
