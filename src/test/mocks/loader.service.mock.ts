import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoaderServiceMock {
  public setLoader(b: boolean): boolean {
    return b;
  }

  public getLoaderEvent(): Observable<any> {
    return Observable.of([{}]);
  }
}
