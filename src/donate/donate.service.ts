import { Injectable } from '@angular/core';

import { Config } from '../app.config';

import 'rxjs/add/operator/map';

@Injectable()
export class DonateService {
  public window: Window = window;

  public showStripeDialog(config: any): void {
    let stripeHandler = (this.window as any).StripeCheckout.configure({
      key: Config.stripPublicKey,
      image: '/assets/img/dollar-street.svg',
      locale: 'auto',
      // tslint:disable-next-line
      token: (token: any) => {}
    });

    this.window.addEventListener('popstate', () => {
      stripeHandler.close();
    });

    stripeHandler.open(config);
  }
}
