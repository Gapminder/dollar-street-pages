import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class LoaderService {
  private loaderEvents: Subject<any>;

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
