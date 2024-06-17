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
}
