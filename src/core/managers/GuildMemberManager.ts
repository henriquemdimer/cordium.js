/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Collection } from "../classes/Collection";
import { Guild } from "../classes/Guild";
import { GuildMember } from "../classes/GuildMember";

export class GuildMemberManager extends Collection<GuildMember> {
  public constructor(client: Client, guild: Guild, members?: any[]) {
    super();
    if (!client || !(client instanceof Client)) throw new Error('GuildMemberManager(client): client is missing or invalid.');
    if (!guild || !(guild instanceof Guild)) throw new Error('GuildMemberManager(guild): guild is missing or invalid');

    if (members) {
      if (!Array.isArray(members)) members = [members];

      for (const Member of members) {
        const member = new GuildMember(client, guild, Member);
        this.set(member.user.id, member);
        client.cache.users.set(member.user.id, member.user);
      }
    }
  }
}
