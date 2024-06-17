/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from "events";
import { Client } from "../Client";
import { MessageEvent, WebSocket } from 'ws';
import { ShardPayload } from "../classes/ShardPayload";

export class Shard extends EventEmitter {
  #token: string;
  #client: Client;
  public ws?: WebSocket;
  public s: number;
  public ready: boolean;
  public ping: number;
  public lastHearbeatSent: number;
  public lastHearbeatAck: number;

  public constructor(token: string, client: Client) {
    super();
    if (!client || !(client instanceof Client)) throw new Error('Shard(client): client is missing or invalid.');
    if (!token || typeof token !== 'string') throw new Error('Shard(token): token is missing or is not a string.');

    this.#token = token;
    this.#client = client;

    this.s = 0;
    this.ping = 0;
    this.ready = false;
    this.lastHearbeatSent = 0;
    this.lastHearbeatAck = 0;

    this.onMessage = this.onMessage.bind(this);
  }

  public connect() {
    this.ws = new WebSocket(this.#client.options.sharding.gatewayUrl);

    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
  }

  private onOpen() {
    super.emit('connected');
  }

  private onMessage(msg: MessageEvent) {
    try {
      const payload = new ShardPayload(msg.data);

      if (payload.s) this.s = payload.s;

      switch (payload.op) {
        case 10:
          if (payload.data.heartbeat_interval && payload.data.heartbeat_interval > 0) {
            this.startHeartbeating(payload.data.heartbeat_interval);
          }

          this.identify();
          break;

        case 11:
          this.lastHearbeatAck = Date.now();
          this.ping = this.lastHearbeatAck - this.lastHearbeatSent;
          this.emit('pingUpdate');
          break;

        case 0:
          this.onEvent(payload);
      }
    } catch (err) {
      this.#client.emit('error', err);
    }
  }

  private async onEvent(payload: ShardPayload) {
    if (!payload) throw new Error('Shard.onEvent(payload): missing payload object.');
    if (payload.op != 0) throw new Error('Shard.onEvent(payload): object is not a event payload');

    switch (payload.t) {
      default:
        try {
          const event = await import(`../events/${payload.t}`);
          if (event && event.default) event.default(this.#client, this, payload.data);
          else this.#client.emit('unhandledEvent', (payload.t, payload.data));
        } catch (err) { /*empty*/ }
        break;
    }
  }

  public sendPayload(op: number, data: any) {
    this.ws?.send(JSON.stringify({ op, d: data }));
  }

  private startHeartbeating(interval: number) {
    setInterval(() => {
      this.sendPayload(1, this.s);
      this.lastHearbeatSent = Date.now();
    }, interval);
  }

  private identify() {
    this.sendPayload(2, {
      token: this.#token,
      v: this.#client.options.rest.apiVersion,
      compress: false,
      intents: this.#client.options.intents,
      properties: {
        $os: process.platform,
        $browser: 'Edwiges/1.0.0',
        $device: 'Edwiges/1.0.0',
      },
    });
  }
}
