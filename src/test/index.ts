import { Client, Intents } from '../';
import { Message } from '../core/classes/Message';
import 'dotenv/config';

(async () => {
  const client = new Client(process.env.TOKEN || '', {
    intents: [
      Intents.ALL
    ]
  });
  client.init();

  client.on('ready', () => {
    console.log(`${client.user?.username} is ready.`);
  });

  client.on('messageCreate', async (msg: Message) => {
    if (msg.content.startsWith('!')) {
      await msg.channel?.send('hello');
      await msg.channel?.send('hello again');
    }
  });
})();
