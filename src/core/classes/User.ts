/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../Client";

export class User {
  public id: string;
  public username: string;
  public discriminator: string;
  public globalName?: string;
  public bot: boolean;
  public avatar?: string;
  public system?: string;
  public mfaEnabled?: boolean;
  public banner?: string;
  public accentColor?: string;
  public locale?: string;
  public verified?: boolean;
  public email?: string;
  public flags?: number;

  public constructor(client: Client, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('User(client): client is missing or invalid.');
    if (!data || !data.id || !data.username || !data.discriminator) throw new Error('User(data): data is missing or invalid');

    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.bot = data.bot || false;
    this.globalName = data.globalName;
    this.avatar = data.avatar;
    this.system = data.system;
    this.mfaEnabled = data.mfa_enabled;
    this.banner = data.banner;
    this.accentColor = data.accent_color;
    this.locale = data.locale;
    this.verified = data.verified;
    this.email = data.email;
    this.flags = data.flags;
  }
}
