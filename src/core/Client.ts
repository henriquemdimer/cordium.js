 
import { RequestManager, RequestManagerOptions } from './rest/RequestManager';
import { GatewayManager, ShardingOptions } from './gateway/GatewayManager';
import { User } from './classes/User';
import { ClientCache } from './cache/ClientCache';
import { ClientEvents } from './ClientEvents';

export interface ClientOptions {
  intents: number | number[];
  rest: RequestManagerOptions;
  sharding: ShardingOptions;
}

export class Client {
  #token: string;
  public rest: RequestManager;
  public shards: GatewayManager;
  public ready: boolean;
  public options: ClientOptions;
  public cache: ClientCache;
  public user?: User;
  public events: ClientEvents;

  public constructor(token: string, options?: Partial<ClientOptions>) {
    if (!token || typeof token != 'string') throw new Error('Client(token): token is missing or is not a string.');

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
    this.cache = new ClientCache(this);
    this.ready = false;
    this.events = new ClientEvents();
  }

  public async getMe() {
    const me = await this.rest.request({
      method: 'get',
      endpoint: '/users/@me',
      auth: true
    });

    this.user = new User(this, me);
    return this.user;
  }

  public async init() {
    try {
      await this.getMe();
      this.shards.init();
    } catch (_) {
      console.log(_);
    }
  }
}
