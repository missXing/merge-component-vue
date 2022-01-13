import { Subject } from 'rxjs';

export class RuleSubscription {
  constructor() {
    this.subscriptions = new Map();
  }

  notify(type, payload) {
    let targetSubscription = this.subscriptions.get(type);

    if (!targetSubscription) {
      this.subscriptions.set(type, new Subject());
    }

    targetSubscription = this.subscriptions.get(type);

    targetSubscription?.next(payload);
  }

  listen(type) {
    let targetSubscription = this.subscriptions.get(type);

    if (!targetSubscription) {
      this.subscriptions.set(type, new Subject());
    }

    targetSubscription = this.subscriptions.get(type);

    return targetSubscription;
  }

  unsubscribe() {
    for (const value of this.subscriptions) {
      value.unsubscribe();
    }
    this.subscriptions.clear();
  }
}
