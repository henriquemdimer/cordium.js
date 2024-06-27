export class Observable<T> {
  public observers: ((arg: T) => void)[] = [];

  public subscribe(callback: (arg: T) => void) {
    this.observers.push(callback);
  }

  public notify(arg?: T) {
    for(const observer of this.observers) {
      observer(arg || {} as T);
    }
  }
}
