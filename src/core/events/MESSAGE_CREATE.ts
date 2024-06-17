/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Message } from "../classes/Message";

export default (client: Client, _: any, d: any) => {
  try {
    client.emit('messageCreate', new Message(client, d));
  } catch (err) {
    console.log(err);
  }
}
