import EventEmitter from "events";
import { RequestManager, RequestManagerOptions } from "./rest/RequestManager";
import { GatewayManager, ShardingOptions } from "./gateway/GatewayManager";
import { User } from "./classes/User";
import { ClientCache } from "./cache/ClientCache";

export interface ClientOptions {
  intents: number | number[];
  rest: RequestManagerOptions;
  sharding: ShardingOptions;
}

export class Client extends EventEmitter {
  #token: string;
  public rest: RequestManager;
  public shards: GatewayManager;
  public ready: boolean;
  public options: ClientOptions;
  public cache: ClientCache;
  public user?: User;

  public constructor(token: string, options?: Partial<ClientOptions>) {
    super();

    if (!token || typeof token != "string") throw new Error("Client(token): token is missing or is not a string.");

    this.options = {
      intents: (Array.isArray(options?.intents) ? options.intents?.reduce((acc, curr) => acc + curr, 0) : options?.intents) || 513,
      rest: {
        apiVersion: options?.rest?.apiVersion || 10,
        alwaysSendAuthorizationHeader: options?.rest?.alwaysSendAuthorizationHeader || false
      },
      sharding: {
        gatewayUrl: options?.sharding?.gatewayUrl || 'wss://gateway.discord.gg/',
        totalShards: options?.sharding?.totalShards || 1,
        connectOneShardAtTime: options?.sharding?.connectOneShardAtTime || true,
        firstShardId: options?.sharding?.firstShardId || 0,
        lastShardId: options?.sharding?.lastShardId || options?.sharding?.totalShards || 1
      }
    };

    this.#token = token;
    this.rest = new RequestManager(this, this.#token);
    this.shards = new GatewayManager(this, this.#token);
    this.ready = false;
    this.cache = new ClientCache(this);
  }

  public async init() {
    try {
      const me = await this.rest.request({
        method: 'get',
        endpoint: '/users/@me',
        auth: true
      });

      this.user = new User(this, me);
      this.shards.init();
    } catch (_) {
      console.log(_);
    }
  }
}
