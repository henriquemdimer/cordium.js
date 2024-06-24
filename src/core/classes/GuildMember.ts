/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";
import { Guild } from "./Guild";
import { User } from "./User";

export class GuildMember {
  public user: User;
  public nick: string | null;
  public avatar: string | null;
  public roles: any;
  public joinedAt: string;
  public premiumSince?: string;
  public deaf: boolean;
  public mute: boolean;
  public flags: number;
  public pending: boolean;
  public permissions: string | null;
  public communicationDisabledUntil?: string;
  public avatarDecorationData?: any;
  public guild: Guild;

  public constructor(client: Client, guild: Guild, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('GuildMember(client): client is missing or invalid');
    if (!data || !data.user || !data.roles || data.deaf == undefined || data.mute == undefined) throw new Error('GuildMember(data): data is missing or invalid');

    this.user = new User(client, data.user);
    this.guild = guild;
    this.nick = data.nick || null;
    this.avatar = data.avatar;
    this.roles = data.roles;
    this.joinedAt = data.joined_at;
    this.premiumSince = data.premium_since || null;
    this.deaf = data.deaf;
    this.mute = data.mute;
    this.flags = data.flags || 0;
    this.pending = data.pending || false;
    this.permissions = data.permission || null
    this.communicationDisabledUntil = data.communication_disabled_until;
    this.avatarDecorationData = data.avatar_decoration_data || null;
  }
}
