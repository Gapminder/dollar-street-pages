import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoaderService {
  public loaderEvents: Subject<any>;

  public constructor() {
    this.loaderEvents = new Subject<any>();
  }

  public setLoader(isLoaded: boolean): void {
    this.loaderEvents.next({isLoaded: isLoaded});
  }

  public getLoaderEvent(): Observable<any> {
    return this.loaderEvents;
  }
}
