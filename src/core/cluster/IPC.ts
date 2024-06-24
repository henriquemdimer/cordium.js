/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events';
import { IPCMessage } from '../classes/IPCMessage';
import VM from 'node:vm';
import { ClusterClient } from './ClusterClient';

export class IPC extends EventEmitter {
  #client: ClusterClient;
  public pid: number;

  public constructor(client: ClusterClient, pid: number) {
    super();

    this.#client = client;
    this.pid = pid;

    process.on('message', (message: any) => {
      const msg = new IPCMessage(message);
      if (!msg) return;

      this.emit('message', msg);
      switch (msg.event) {
      case 'data-request': {
        if (!msg.data) return;

        const context = { client: this.#client };
        VM.createContext(context);

        const result = VM.runInContext(msg.data, context);
        this.reply(msg.from, msg.cid, 'data-response', result);
        break;
      }
      }
    });
  }

  public reply(to: number | string, cid: string, event: string, result: any) {
    process.send?.(new IPCMessage({ to, cid, result: { workerPid: this.pid, workerId: this.#client.workerId, data: result }, from: this.pid, event }));
  }

  public send(to: number | string, cid: string, data: any, event: string) {
    process.send?.(new IPCMessage({ to, from: this.pid, cid, data, event }));
  }

  public broadcast(data: any): Promise<any> {
    return new Promise((resolve) => {
      const id = IPCMessage.generateCID();
      this.send('master', id, data, 'broadcast-request');

      const callback = (message: any) => {
        const response = new IPCMessage(message);
        if (!response || !response.cid || response.cid !== id) return;

        process.removeListener('message', callback);
        resolve(response.data);
      };

      process.on('message', callback);
    });
  }
}
