import { Collection } from '../classes/Collection';
import { User } from '../classes/User';
import { Client } from '../Client';

export class UserCache extends Collection<User> {
  public constructor(client: Client, users?: User[]) {
    super();

    if (!client || !(client instanceof Client)) throw new Error('UserManager(client): client is missing or invalid');

    if (users) {
      if (!Array.isArray(users)) users = [users];

      for (const _user of users) {
        const user = new User(client, _user);
        super.set(user.id, user);
      }
    }
  }
}
