import {Inject} from "angular2/core";
import {Location} from "angular2/router";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

export class UrlChangeService {
  public location:Location;
  private urlEvents:Subject<any>;
  private popStateSub:Subject<any>;
  private popState:(location:any)=>void;
  private onPopstate:boolean;

  constructor(@Inject(Location) location) {
    this.urlEvents = new Subject();
    this.popStateSub = new Subject();
    this.location = location;
    // this.location.subscribe((a)=> {
    //   console.log('change 11111')
    //   this.onPopstate = true;
    //   this.urlEvents.next('my event');
    // });
  }
  replaceState(path:string, query?:string):void {
    // if (this.onPopstate) {
    //   this.onPopstate = !this.onPopstate;
    //   return;
    // }
    this.location.go(path, query);
  }

  getUrlEvents():Observable {
    return this.urlEvents;
  }

}
