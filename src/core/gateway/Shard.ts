/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';
import { MessageEvent, WebSocket } from 'ws';
import { ShardPayload } from '../classes/ShardPayload';
import { Guild } from '../classes/Guild';
import { Message } from '../classes/Message';
import { TextChannel } from '../classes/TextChannel';
import { Observable } from '../classes/Observable';

export class Shard {
  #token: string;
  #client: Client;
  public ws?: WebSocket;
  public id: number;
  public s: number;
  public ready: boolean;
  public ping: number;
  public lastHearbeatSent: number;
  public lastHearbeatAck: number;
  public events = {
    connect: new Observable(),
    shardReady: new Observable<Shard>(),
    pingUpdate: new Observable()
  };

  public constructor(token: string, client: Client, id: number) {
    if (!client || !(client instanceof Client)) throw new Error('Shard(client): client is missing or invalid.');
    if (!token || typeof token !== 'string') throw new Error('Shard(token): token is missing or is not a string.');

    this.#token = token;
    this.#client = client;

    this.id = id;
    this.s = 0;
    this.ping = 0;
    this.ready = false;
    this.lastHearbeatSent = 0;
    this.lastHearbeatAck = 0;

    this.onMessage = this.onMessage.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  public connect() {
    this.ws = new WebSocket(`${this.#client.options.sharding.gatewayUrl}?v=${this.#client.options.rest.apiVersion}&encoding=json`);

    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
  }

  private onOpen() {
    this.events.connect.notify();
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
        this.events.pingUpdate.notify();
        break;

      case 9:
        this.s = 0;
        this.identify();
        break;

      case 0:
        this.onEvent(payload);
        break;
      }
    } catch (err) {
      this.#client.events.error.notify(err);
    }
  }

  private async onEvent(payload: ShardPayload) {
    if (!payload) throw new Error('Shard.onEvent(payload): missing payload object.');
    if (payload.op != 0) throw new Error('Shard.onEvent(payload): object is not a event payload');

    switch (payload.t) {
    case 'READY':
      this.ready = true;
      this.#client.events.shardReady.notify(this);
      this.events.shardReady.notify(this);
      break;

    case 'GUILD_CREATE': {
      const guild = new Guild(this.#client, payload.data);
      this.#client.cache.guilds.set(guild.id, guild);
      break;
    }

    case 'MESSAGE_CREATE':
      const message = new Message(this.#client, payload.data);

      const guild = this.#client.cache.guilds.get(payload.data.guild_id);
      if(guild) {
        const channel = guild.cache.channels.get<TextChannel>(payload.data.channel_id);
        if(channel) channel.cache.messages.set(message.id, message);
      }

      this.#client.events.messageCreate.notify(message);
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
      shard: [this.id, (this.#client.options.sharding.lastShardId || 0)],
      properties: {
        $os: process.platform,
        $browser: 'Edwiges/1.0.0',
        $device: 'Edwiges/1.0.0',
      },
    });
  }
}
