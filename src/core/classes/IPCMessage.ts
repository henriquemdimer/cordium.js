/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResult {
  workerPid: number;
  workerId: number;
  data: any;
}

export interface IIPCMessage {
  from: number | string;
  to?: number | string | null;
  event: string;
  cid: string;
  data?: any | null;
  result?: IResult | null;
}

export class IPCMessage {
  public from: number | string;
  public to?: number | string | null;
  public event?: string | null;
  public cid: string;
  public data?: any;
  public result?: IResult | null;

  public constructor(options: IIPCMessage) {
    if (!options.cid) throw new Error('IPCMessage(options.cid): cid (A.K.A communication id) is required.');
    if (!options.event) throw new Error('IPCMessage(options.event): event is required but is missing.');
    if (!options.from) throw new Error('IPCMessage(options.from): from (sender PID) is required but is missing.');

    this.from = options.from;
    this.to = options.to || null;
    this.event = options.event;
    this.data = options.data || null;
    this.cid = options.cid;
    this.result = options.result ?? null;
  }

  public static generateCID() {
    return crypto.randomUUID();
  }
}
