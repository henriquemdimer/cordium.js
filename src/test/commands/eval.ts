import util from "node:util";
import vm from "node:vm";
import type { Client } from "../../core/Client";
import type { Message } from "../../core/classes/Message";
import type { ClusterClient } from "../../core/cluster/ClusterClient";

export default async (client: Client | ClusterClient, msg: Message) => {
	if (!msg.content || msg.author.id !== "465599065007194113")
		return await msg.sendReference("Vai tu te fude");
	const content = msg.content?.split(" ").slice(1).join(" ");

	try {
		const context = { client, msg };

		vm.createContext(context);
		let evalued = await vm.runInContext(
			`(async () => { return ${content} })()`,
			context,
		);
		evalued = util.inspect(evalued, true, 1);

		return await msg.sendReference(`\`\`\`js\n${evalued}\`\`\``);
	} catch (err) {
		await msg.sendReference(`\`\`\`js\n${err}\`\`\``);
	}
};
