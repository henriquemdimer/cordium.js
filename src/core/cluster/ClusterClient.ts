import { Client, ClientOptions } from "../Client";
import { IPC } from "./IPC";

export class ClusterClient extends Client {
  public ipc: IPC;
  public workerId: number;

  public constructor(token: string, options: Partial<ClientOptions>, workerId: number) {
    super(token, options);

    this.ipc = new IPC(this, process.pid);
    this.workerId = workerId;
  }
}
