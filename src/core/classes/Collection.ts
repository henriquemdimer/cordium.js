// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class Collection<T = {}> extends Map {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public get<V extends T>(key: any): V | null {
		return super.get(key);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public set<V extends T>(key: any, value: V): V {
		super.set(key, value);
		return value;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public remove(key: any): boolean {
		return super.delete(key);
	}

	public toArray(): T[] {
		return Array.from(super.values());
	}

	public first() {
		return this.toArray()[0];
	}

	public last() {
		return this.toArray()[super.size - 1];
	}

	public random() {
		return this.toArray()[Math.floor(Math.random() * super.size)];
	}
}
