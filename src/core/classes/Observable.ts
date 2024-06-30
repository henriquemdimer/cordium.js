import { randomUUID } from 'node:crypto'

import { Collection } from './Collection'

export class Subscription<CallbackArgType = any> {
	readonly _id: string = randomUUID()
	
	constructor(public callback: (arg: CallbackArgType) => any) {}
}

export class Observable<CallbackArgType> {
	public subscriptions = new Collection<Subscription>()
  
	public notify(arg?: CallbackArgType) {
		for(const subscription of this.subscriptions.toArray()) {
			subscription.callback(arg)
		}
	}

	public remove(subscription: string | Subscription) {
		const subscriptionId = typeof subscription === 'string' ? subscription : subscription._id

		this.subscriptions.remove(subscriptionId)
	}

	public subscribe(callback: (arg: CallbackArgType) => any) {
		const subscription = new Subscription(callback)

		this.subscriptions.set(subscription._id, subscription)

		return subscription
	}
}