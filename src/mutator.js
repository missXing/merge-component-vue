import { RuleSubscription } from './subscription';

export class Mutator {
  constructor() {
    this._context = new RuleSubscription();
  }

  push(value) {
    this._context.notify('push', value);
  }

  remove() {
    this._context.notify('remove', {});
  }

  copy() {
    this._context.notify('copy', {});
  }

  on(eventName) {
    this._context.listen(eventName).unsubscribe();
    this._context.subscriptions.delete(eventName);
    return this._context.listen(eventName);
  }
}
