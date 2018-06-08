import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class DonateService {
  public window: Window = window;

  public constructor(private http: Http) {
  }

  public showStripeDialog(config: any, cb: Function): void {
    let stripeHandler = (this.window as any).StripeCheckout.configure({
      key: environment.stripPublicKey,
      image: '/assets/img/dollar-street.svg',
      locale: 'auto',
      // tslint:disable-next-line
      token: (token: any) => {
        const query: any = { amount: config.amount, token: token };
        this.makeDonate(query).subscribe((res: any) => {
          if(!res.err) {
             cb();
          }
        });
      }
    });

    this.window.addEventListener('popstate', () => {
      stripeHandler.close();
    });

    stripeHandler.open(config);
  }

  public makeDonate(query: any): Observable<any> {
    return this.http.post(`${environment.consumerApi}/v1/donate`, query).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return parseRes;
    });
  }
}
