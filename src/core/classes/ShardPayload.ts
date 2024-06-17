/* eslint-disable @typescript-eslint/no-explicit-any */
import { Data } from "ws";

export class ShardPayload {
  public op: number;
  public t?: string;
  public data?: any;
  public s?: number;

  public constructor(rawPayload: Data) {
    try {
      const payload = JSON.parse(rawPayload.toString());

      this.op = payload.op;
      this.t = payload.t || null;
      this.s = payload.s ?? null;
      this.data = payload.d;
    } catch (_) {
      throw new Error('ShardPayload(rawPayload): rawPayload is invalid.');
    }
  }
}
