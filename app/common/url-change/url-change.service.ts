import {Injectable} from "angular2/core";
import {Location} from "angular2/router";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UrlChangeService {
  private location:Location;
  private urlEvents:Subject<any>;

  constructor(_location:Location) {
    this.urlEvents = new Subject();
    this.location = _location;
  }

  replaceState(path:string, query?:string):void {
    this.location.replaceState(path, query);
    this.urlEvents.next({path, query});
  }

  getUrlEvents():Observable {
    return this.urlEvents;
  }

  parseUrl(url:string):any {
    url = '{\"' + url.replace(/&/g, '\",\"') + '\"}';
    url = url.replace(/=/g, '\":\"');
    return JSON.parse(url);
  }

}
