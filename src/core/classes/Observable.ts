import { randomUUID } from "node:crypto";

import { Collection } from "./Collection";

export class Subscription<CallbackArgType> {
	readonly _id: string = randomUUID();

	constructor(
		readonly observer: Observable<CallbackArgType>,
		public callback: (arg: CallbackArgType) => unknown,
	) {}

	public remove() {
		return this.observer.removeSubscription(this);
	}
}

export class Observable<CallbackArgType> {
	public subscriptions = new Collection<Subscription<CallbackArgType>>();

	public notify(arg: CallbackArgType) {
		for (const subscription of this.subscriptions.toArray()) {
			subscription.callback(arg);
		}
	}

	public removeSubscription(
		subscription: Subscription<CallbackArgType> | string,
	) {
		const subscriptionId =
			typeof subscription === "string" ? subscription : subscription._id;

		return !!this.subscriptions.remove(subscriptionId);
	}

	public subscribe(callback: (arg: CallbackArgType) => unknown) {
		const subscription = new Subscription(this, callback);

		this.subscriptions.set(subscription._id, subscription);

		return subscription;
	}
}
