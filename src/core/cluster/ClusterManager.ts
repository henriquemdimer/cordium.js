/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientOptions } from '../Client';
import Cluster, { Worker } from 'cluster';
import { IPCMessage, IResult } from '../classes/IPCMessage';
import { ClusterClient } from './ClusterClient';
import { Observable } from '../classes/Observable';
import { ClusterEvents } from '../events/ClusterEvents';

export interface ClusterManagerOptions extends ClientOptions {
  clustering: {
    totalWorkers?: number;
  }
}

export class ClusterManager {
  #token: string;
  public options: Partial<ClusterManagerOptions>;
  public workers: Worker[];
  public events: ClusterEvents;

  public constructor(token: string, options: Partial<ClusterManagerOptions>) {
    this.#token = token;
    this.options = options;
    this.workers = [];
    this.events = new ClusterEvents();
  }

  public async init(): Promise<this> {
    if (Cluster.isPrimary) {
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

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk) break;

        const worker = Cluster.fork();
        worker.setMaxListeners(9999);
        this.workers.push(worker);

        worker.send({ index: i, token: this.#token, shards: chunk, total: this.options.sharding?.totalShards || 2, event: 'master-initial' });

        worker.on('message', (message) => {
          const msg = new IPCMessage(message);
          if (!msg) return;

          const sender = this.workers.find((w) => w.process.pid == msg.from);
          if (!sender || !sender.process.pid) return;

          switch (msg.event) {
          case 'broadcast-request': {
            let reqsSent = 0;
            const result: IResult[] = [];
            const cid = IPCMessage.generateCID();

            for (const worker of this.workers) {
              worker.send(new IPCMessage({ from: 'master', to: worker.process.pid, event: 'data-request', cid, data: msg.data }));
              reqsSent++;

              const callback = (message: any) => {
                const response = new IPCMessage(message);
                if (response.cid !== cid || response.result == undefined) return;

                result.push(response.result);
                if (result.length >= reqsSent) {
                  worker.removeListener('message', callback);
                  sender.send(new IPCMessage({ from: 'master', to: sender.process.pid || 0, event: 'broadcast-response', data: result, cid: msg.cid }));
                }
              };

              worker.on('message', callback);
            }

            break;
          }
          }
        });
      }
    } else {
      process.on('message', (msg: any) => {
        if (msg.event == 'master-initial') {
          const options = {
            ...this.options,
            sharding: {
              totalShards: msg.shards.length,
              firstShardId: msg.shards[0],
              lastShardId: msg.total,
            },
          };

          const client = new ClusterClient(msg.token, options, msg.index);
          this.events.workerSpawned.notify(client);
        }
      });
    }

    return this;
  }
}
