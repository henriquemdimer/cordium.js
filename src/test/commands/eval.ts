/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../../core/Client';
import { Message } from '../../core/classes/Message';
import util from 'util';
import { ClusterClient } from '../../core/cluster/ClusterClient';

export default async (client: Client | ClusterClient, msg: Message) => {
  try {
    let content: any = msg.content.split(' ');
    content.shift();
    content = content.join(' ');

    if (!msg.content || msg.author.id !== '465599065007194113') return await msg.channel?.send('Vai tu te fude');
    let evalued = eval(`(async () => {${content}})()`);

    if (evalued && evalued.constructor.name == 'Promise')
      evalued = await evalued;

    if (typeof evalued !== 'string')
      evalued = util.inspect(evalued, { depth: 1 });

    evalued = evalued
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));

    await msg.channel?.send(`\`\`\`js\n${evalued}\`\`\``);
  } catch (err) {
    await msg.channel?.send(`\`\`\`js\n${err}\`\`\``);
  }
};
