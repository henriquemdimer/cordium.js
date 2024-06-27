import { Message } from './classes/Message';
import { Observable } from './classes/Observable';
import { Client } from './Client';
import { Shard } from './gateway/Shard';

export class ClientEvents {
  public ready: Observable<Client> = new Observable<Client>();
  public shardReady: Observable<Shard> = new Observable<Shard>();
  public messageCreate: Observable<Message> = new Observable<Message>();
  public error: Observable<unknown> = new Observable<unknown>();
}
