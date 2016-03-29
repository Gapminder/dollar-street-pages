import {Inject} from "angular2/core";
import {Location} from "angular2/router";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

export class UrlChangeService {
  public location:Location;
  private urlEvents:Subject<any>;

  constructor(@Inject(Location) location) {
    this.urlEvents = new Subject();
    this.location = location;
  }

  replaceState(path:string, query?:string):void {
    this.location.go(path, query);
    this.urlEvents.next('my event');
  }

  getUrlEvents():Observable<any>{
    return this.urlEvents;
  }
}
