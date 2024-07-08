export interface IPCData {
	workerPid: number;
	workerId: number;
	content: unknown;
	error?: boolean;
}

export type IPCEvent =
	| "master-initial"
	| "broadcast-request"
	| "broadcast-response"
	| "data-request"
	| "data-response";

export interface IIPCMessage {
	from: number | string;
	to?: number | string | null;
	event: IPCEvent;
	cid: string;
	data: IPCData;
}

export class IPCMessage {
	public from: number | string;
	public to?: number | string | null;
	public event: IPCEvent;
	public cid: string;
	public data: IPCData;

	public constructor(options: IIPCMessage) {
		if (!options.cid)
			throw new Error(
				"IPCMessage(options.cid): cid (A.K.A communication id) is required.",
			);
		if (!options.event)
			throw new Error(
				"IPCMessage(options.event): event is required but is missing.",
			);
		if (!options.from)
			throw new Error(
				"IPCMessage(options.from): from (sender PID) is required but is missing.",
			);
		if (!options.data)
			throw new Error(
				"IPCMessage(options.data): data is required but is missing.",
			);

		this.from = options.from;
		this.to = options.to || null;
		this.event = options.event;
		this.data = options.data;
		if (this.data.error === undefined || this.data.error == null)
			this.data.error = false;

		this.cid = options.cid;
	}

	public reply(event: IPCEvent, data: IPCData, to?: IIPCMessage["to"]) {
		process.send?.(
			new IPCMessage({ from: process.pid, cid: this.cid, event, data, to }),
		);
	}

	public static generateCID() {
		return crypto.randomUUID();
	}
}
