import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Inject } from '@angular/core';

export class UrlChangeService {
  private location: Location;
  private urlEvents: Subject<any>;

  public constructor(@Inject(Location) location: Location) {
    this.urlEvents = new Subject();
    this.location = location;
  }

  public replaceState(path: string, query?: string): void {
    this.location.go(path, query);
    this.urlEvents.next('my event');
  }

  public getUrlEvents(): Observable<any> {
    return this.urlEvents;
  }
}
