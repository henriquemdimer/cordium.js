import { Observable } from "../classes/Observable";
import type { Shard } from "../gateway/Shard";

export class ShardEvents {
	public shardReady = new Observable<Shard>();
	public pingUpdate = new Observable<null>();
	public connect = new Observable<null>();
}
