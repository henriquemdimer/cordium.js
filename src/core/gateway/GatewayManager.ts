import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { Shard } from "./Shard";

export interface ShardingOptions {
  gatewayUrl?: string;
  totalShards?: number;
  connectOneShardAtTime?: boolean;
  firstShardId?: number;
  lastShardId?: number;
}

export class GatewayManager extends Collection<Shard> {
  #client: Client;
  #token: string;
  public ping: number;

  public constructor(client: Client, token: string, options?: ShardingOptions) {
    super();

    if (!client || !(client instanceof Client)) throw new Error('GatewayManager(client): client is missing or invalid.');
    if (!token || typeof token != 'string') throw new Error('GatewayManager(token): token is missing or is not a string.');

    this.#client = client;
    this.#token = token;
    this.ping = 0;
  }

  public init() {
    if (this.#client.options.sharding.connectOneShardAtTime === false) {
      for (let i = this.#client.options.sharding.firstShardId || 0; i < (this.#client.options.sharding.totalShards || 1); i++) {
        this.spawn(i);
      }
    } else {
      this.spawn(this.#client.options.sharding.firstShardId || 0);
    }
  }

  public spawn(id: number) {
    let shard = super.get(id);
    if (!shard) {
      shard = super.set(id, new Shard(this.#token, this.#client, id));

      shard.on('shardReady', () => {
        const connectedShards = Array.from(this.values()).filter((s) => s.ready == true);

        if (connectedShards.length >= (this.#client.options.sharding.totalShards || 1)) {
          this.#client.ready = true;
          this.#client.emit('ready');
        } else if (this.#client.options.sharding.connectOneShardAtTime) {
          this.spawn(id + 1);
        }
      });

      shard.on('pingUpdate', () => {
        let ping = 0;

        for (const shard of Array.from(this.values())) {
          ping += shard.ping;
        }

        this.ping = ping / this.size;
      })
    }

    if (shard) {
      shard.connect();
    }
  }
}
