import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, SubscriptionLike } from 'rxjs';

@Injectable()
export class UnsubscribeService implements OnDestroy {
  private subscriptions = new Subscription();

  public set subs(
    sub: Subscription | SubscriptionLike | Subscription[] | SubscriptionLike[]
  ) {
    if (Array.isArray(sub)) {
      sub.forEach((s) => this.subscriptions.add(s));
    } else {
      this.subscriptions.add(sub);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
