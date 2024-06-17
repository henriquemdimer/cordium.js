import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { Shard } from "./Shard";

export interface ShardingOptions {
  gatewayUrl: string;
}

export class GatewayManager extends Collection<Shard> {
  #client: Client;
  #token: string;
  public ping: number;
  public options: ShardingOptions;

  public constructor(client: Client, token: string, options?: ShardingOptions) {
    super();

    if (!client || !(client instanceof Client)) throw new Error('GatewayManager(client): client is missing or invalid.');
    if (!token || typeof token != 'string') throw new Error('GatewayManager(token): token is missing or is not a string.');

    if (options) this.options = options;
    else this.options = {
      gatewayUrl: 'wss://gateway.discord.gg/?v=10&encoding=json'
    }

    this.#client = client;
    this.#token = token;
    this.ping = 0;
  }

  public init() {
    this.spawn(0);
  }

  public spawn(id: number) {
    let shard = super.get(id);
    if (!shard) {
      shard = super.set(id, new Shard(this.#token, this.#client));

      shard.on('shardReady', () => {
        this.#client.ready = true;
        this.#client.emit('ready');
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
