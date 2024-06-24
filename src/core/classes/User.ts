/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../Client';

export class User {
  public id: string;
  public username: string;
  public discriminator: string;
  public globalName: string | null;
  public bot: boolean;
  public avatar: string | null;
  public system: string | null;
  public mfaEnabled?: boolean;
  public banner: string | null;
  public accentColor: string | null;
  public locale: string | null;
  public verified: boolean;
  public email: string | null;
  public flags?: number;
  public publicFlags?: number | null;

  public constructor(client: Client, data: any) {
    if (!client || !(client instanceof Client)) throw new Error('User(client): client is missing or invalid.');
    if (!data || !data.id || !data.username || !data.discriminator) throw new Error('User(data): data is missing or invalid');

    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.bot = data.bot || false;
    this.globalName = data.global_name || null;
    this.avatar = data.avatar || null;
    this.system = data.system || null;
    this.mfaEnabled = data.mfa_enabled || false;
    this.banner = data.banner || null;
    this.accentColor = data.accent_color || null;
    this.locale = data.locale || null;
    this.verified = data.verified || false;
    this.email = data.email || null;
    this.flags = data.flags ?? null;
    this.publicFlags = data.public_flags ?? null;
  }
}
