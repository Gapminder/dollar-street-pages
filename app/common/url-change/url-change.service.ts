import {Inject} from "angular2/core";
import {Location} from "angular2/router";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

export class UrlChangeService {
  private location:Location;
  private urlEvents:Subject<any>;
  private popStateSub:Subject<any>;
  private popState:(location:any)=>void;
  private onPopstate:boolean;

  constructor(@Inject(Location) location) {
    this.urlEvents = new Subject();
    this.popStateSub = new Subject();
    this.location = location;
    this.location.subscribe((a)=> {
      this.onPopstate = true;
    });
  }

  replaceState(path:string, query?:string):void {
    if (this.onPopstate) {
      this.onPopstate = !this.onPopstate;
      return;
    }
    this.location.go(path, query);
    this.urlEvents.next({path, query});
  }

  getUrlEvents():Observable {
    return this.urlEvents;
  }
  
}
