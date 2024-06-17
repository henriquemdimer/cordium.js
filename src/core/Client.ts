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
        gatewayUrl: options?.sharding?.gatewayUrl || 'wss://gateway.discord.gg/?v=10&encoding=json'
      }
    };

    this.#token = token;
    this.rest = new RequestManager(this.#token, this.options.rest);
    this.shards = new GatewayManager(this, this.#token, this.options.sharding);
    this.ready = false;
    this.cache = new ClientCache(this);
  }

  public init() {
    this.shards.init();
  }
}
