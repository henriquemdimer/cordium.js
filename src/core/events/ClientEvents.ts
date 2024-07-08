import type { Client } from "../Client";
import type { Message } from "../classes/Message";
import { Observable } from "../classes/Observable";
import type { Shard } from "../gateway/Shard";

export class ClientEvents {
	public ready = new Observable<Client>();
	public shardReady = new Observable<Shard>();
	public messageCreate = new Observable<Message>();
	public error = new Observable<unknown>();
}
