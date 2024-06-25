 
import { Client } from '../../core/Client';
import { Message } from '../../core/classes/Message';
import util from 'util';
import { ClusterClient } from '../../core/cluster/ClusterClient';
import vm from 'vm';

export default async (client: Client | ClusterClient, msg: Message) => {
  if (!msg.content || msg.author.id !== '465599065007194113') return await msg.sendReference('Vai tu te fude');
  const content = msg.content?.split(' ').slice(1).join(' ');

  try {
    const context = { client, msg };

    vm.createContext(context);
    let evalued = await vm.runInContext(`(async () => { return ${content} })()`, context);
    evalued = util.inspect(evalued, true, 1);

    return await msg.sendReference(`\`\`\`js\n${evalued}\`\`\``);
  } catch (err) {
    await msg.sendReference(`\`\`\`js\n${err}\`\`\``);
  }
};
