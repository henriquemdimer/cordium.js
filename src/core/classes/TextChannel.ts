/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextChannelCacheManager } from '../managers/TextChannelCacheManager';
import { Client } from '../Client';
import { RequestReponse } from '../rest/RequestManager';
import { Guild } from './Guild';
import { GuildChannel } from './GuildChannel';
import { Message } from './Message';

export interface IMessageReference {
  messageId: string;
  channelId?: string;
  guildId: string;
}

export interface IMessageSendOptions {
  content?: string;
  tts?: boolean;
  messageReference?: IMessageReference;
}

export class TextChannel extends GuildChannel {
  public lastMessageId?: string;
  public cache: TextChannelCacheManager;
  #client: Client;

  public constructor(client: Client, guild: Guild, data: any) {
    super(client, guild, data);

    this.#client = client;
    this.cache = new TextChannelCacheManager(client);
    this.lastMessageId = data.lastMessageId;
  }

  private parseSendOptions(rawOptions: IMessageSendOptions) {
    const options: any = {};

    if(rawOptions?.tts) options.tts = true;
    if(rawOptions?.messageReference) {
      if(!rawOptions.messageReference.messageId) throw new Error('TextChannel.send(options.messageReference.messageId): messageId is required but is missing');
      if(!rawOptions.messageReference.guildId) throw new Error('TextChannel.send(options.messageReference.guildId): guildId is required but is missing');
      options.message_reference = {};

      options.message_reference.message_id = rawOptions.messageReference.messageId;
      options.message_reference.guild_id = rawOptions.messageReference.guildId;
      if(rawOptions.messageReference.channelId) options.message_reference.channel_id = rawOptions.messageReference.channelId;
    }

    return options;
  }

  public async sendMessage(content: string, options?: IMessageSendOptions): Promise<Message> {
    const res = await this.#client.rest.request({
      method: 'post',
      endpoint: `/channels/${this.id}/messages`,
      body: {
        content,
        ...(options ? this.parseSendOptions(options) : {})
      },
      auth: true
    });

    return new Message(this.#client, res.data);
  }

  public async deleteMessage(id: string): Promise<RequestReponse> {
    return await this.#client.rest.request({ method: 'DELETE', endpoint: `/channels/${this.id}/messages/${id}`, auth: true });
  }
}
