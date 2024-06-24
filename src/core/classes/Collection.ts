/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Collection<T = {}> extends Map {
  public constructor() {
    super();
  }

  public get<V extends T>(key: any): V | null {
    return super.get(key);
  }

  public set<V extends T>(key: any, value: V): V {
    super.set(key, value);
    return value;
  }

  public toArray() {
    return Array.from(this.values());
  }

  public first() {
    return this.toArray()[0];
  }

  public last() {
    return this.toArray()[this.size - 1];
  }

  public random() {
    return this.toArray()[Math.floor(Math.random() * this.size)];
  }
}
