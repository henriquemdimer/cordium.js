import EventEmitter from "node:events";
import VM from "node:vm";
import { type IPCData, type IPCEvent, IPCMessage } from "../classes/IPCMessage";
import type { ClusterClient } from "./ClusterClient";

export class IPC extends EventEmitter {
	#client: ClusterClient;
	public pid: number;

	public constructor(client: ClusterClient, pid: number) {
		super();

		this.#client = client;
		this.pid = pid;

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		process.on("message", (message: any) => {
			const msg = new IPCMessage(message);
			if (!msg) return;

			this.emit("message", msg);
			switch (msg.event) {
				case "data-request":
					try {
						if (!msg.data) return;

						const context = { client: this.#client, process };
						VM.createContext(context);

						const result = VM.runInContext(msg.data.content as string, context);
						msg.reply(
							"data-response",
							{
								workerId: this.#client.workerId,
								workerPid: this.pid,
								content: result ?? null,
							},
							msg.from,
						);
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					} catch (err: any) {
						msg.reply(
							"data-response",
							{
								error: true,
								workerId: this.#client.workerId,
								workerPid: this.pid,
								content: err.message,
							},
							msg.from,
						);
					}
					break;
			}
		});
	}

	public send(
		to: number | string,
		data: IPCData,
		event: IPCEvent,
		cid?: string,
	) {
		process.send?.(
			new IPCMessage({
				to,
				from: this.pid,
				cid: cid || this.generateCID(),
				data,
				event,
			}),
		);
	}

	public broadcast(data: IPCData["content"]): Promise<Array<IPCData>> {
		return new Promise((resolve) => {
			const id = IPCMessage.generateCID();
			this.send(
				"master",
				{ workerId: this.#client.workerId, workerPid: this.pid, content: data },
				"broadcast-request",
				id,
			);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const callback = (message: any) => {
				const response = new IPCMessage(message);
				if (!response || !response.cid || response.cid !== id) return;

				process.removeListener("message", callback);
				resolve(response.data.content as Array<IPCData>);
			};

			process.on("message", callback);
		});
	}

	public generateCID() {
		return IPCMessage.generateCID();
	}
}
