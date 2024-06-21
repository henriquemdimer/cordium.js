import EventEmitter from "events";
import { Client, ClientOptions } from "../Client";
import cluster from "cluster";

export interface ClusterManagerOptions extends ClientOptions {
  clustering: {
    totalWorkers?: number;
  }
}

export class ClusterManager extends EventEmitter {
  #token: string;
  public options: Partial<ClusterManagerOptions>;

  public constructor(token: string, options: Partial<ClusterManagerOptions>) {
    super();

    this.#token = token;
    this.options = options;
  }

  public async init(): Promise<this> {
    if (cluster.isPrimary) {
      const chunks = [];
      const shards = [];
      const sep = (this.options.sharding?.totalShards || 2) / (this.options.clustering?.totalWorkers || 1);

      for (let i = 0; i < (this.options.sharding?.totalShards || 2); i++) {
        shards.push(i);
      }

      for (let i = 0; i < shards.length; i += sep) {
        const chunk = shards.slice(i, i + sep);
        if (chunk.length) chunks.push(chunk);
      }

      for (const chunk of chunks) {
        const worker = cluster.fork();

        worker.send({ token: this.#token, shards: chunk, total: this.options.sharding?.totalShards || 2, event: 'MASTER-INITIAL' });
        await new Promise((resolve) => {
          worker.on('message', resolve);
        });
      }
    } else {
      process.on('message', (msg: any) => {
        if (msg.event == 'MASTER-INITIAL') {
          const options = {
            ...this.options,
            sharding: {
              totalShards: msg.shards.length,
              firstShardId: msg.shards[0],
              lastShardId: msg.total,
            },
          }

          const client = new Client(msg.token, options);
          this.emit('workerSpawned', client);
          process.send?.('ready');
        }
      })
    }

    return this;
  }
}
