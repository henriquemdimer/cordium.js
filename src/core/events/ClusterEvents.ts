import { Observable } from '../classes/Observable';
import { ClusterClient } from '../cluster/ClusterClient';

export class ClusterEvents {
  public workerSpawned = new Observable<ClusterClient>();
}
