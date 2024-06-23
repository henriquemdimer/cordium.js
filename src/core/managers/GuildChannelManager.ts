/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { Guild } from "../classes/Guild";
import { GuildChannel } from "../classes/GuildChannel";
import { TextChannel } from "../classes/TextChannel";
import { ChannelTypes } from "../constants/ChannelTypes";

export class GuildChannelManager extends Collection<GuildChannel> {
  public constructor(client: Client, guild: Guild, channels?: any[]) {
    super();
    if (!client || !(client instanceof Client)) throw new Error('GuildChannelManager(client): client is missing or invalid');
    if (!guild || !(guild instanceof Guild)) throw new Error('GuildChannelManager(guild): guild is missing or invalid');

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
}
