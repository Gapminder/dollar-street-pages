import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class CountryDetectorService {
    public constructor(private http: Http) {
    }

    public getCountry(): Observable<any> {
        return this.http
        .get('http://ip-api.com/json')
        .map((res: any) => {
            let parseRes = JSON.parse(res._body);

            return {err: parseRes.error, data: parseRes};
      });
    }
}
