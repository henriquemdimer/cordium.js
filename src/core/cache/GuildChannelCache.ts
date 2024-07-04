/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';
import { ChannelTypes } from '../Constants';
import { Collection } from '../classes/Collection';
import { Guild } from '../classes/Guild';
import { GuildChannel } from '../classes/GuildChannel';
import { TextChannel } from '../classes/TextChannel';

export class GuildChannelCache extends Collection<GuildChannel> {
  #client: Client;
  public guild: Guild;

  public constructor(client: Client, guild: Guild, channels?: any[]) {
    super();
    if (!client || !(client instanceof Client)) throw new Error('GuildChannelManager(client): client is missing or invalid');
    if (!guild || !(guild instanceof Guild)) throw new Error('GuildChannelManager(guild): guild is missing or invalid');

    this.#client = client;
    this.guild = guild;
    if (channels) {
      if (!Array.isArray(channels)) channels = [channels];

      for (const Channel of channels) {
        let channel: GuildChannel;

        if (Channel.type == ChannelTypes.GUILD_TEXT) channel = new TextChannel(client, guild, Channel);
        else channel = new GuildChannel(client, guild, Channel);

        super.set(channel.id, channel);
      }
    }
  }

  public async fetch(id: string) {
    if (!id) throw new Error('GuildChannelCache.fetch(id): id is required but is missing.');

    const res = await this.#client.rest.request({ method: 'GET', endpoint: `/channels/${id}`, auth: true });
    if (res.data) {
      if (res.data.type == ChannelTypes.GUILD_TEXT) return new TextChannel(this.#client, this.guild, res.data);
      else return new GuildChannel(this.#client, this.guild, res.data);
    }
  }

}
