import type { Worker } from "node:cluster";
import { Observable } from "../classes/Observable";
import type { ClusterClient } from "../cluster/ClusterClient";

export class ClusterEvents {
	public workerSpawned = new Observable<ClusterClient>();
	public workerExit = new Observable<Worker>();
}
