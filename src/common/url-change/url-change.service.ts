import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UrlChangeService {
  private location: Location;
  private urlEvents: Subject<any>;

  public constructor(@Inject(Location) location: Location) {
    this.urlEvents = new Subject();
    this.location = location;
  }

  public replaceState(path: string, query: string, isReplace?: boolean): void {
    if (this.isCurrentPathEqualTo(path, query)) {
      return;
    }

    if (isReplace) {
      this.location.replaceState(path, query);
    } else {
      this.location.go(path, query);
    }

    this.urlEvents.next('my event');
  }

  public isCurrentPathEqualTo(path: string, query: string): boolean {
    return this.location.isCurrentPathEqualTo(path, query);
  }

  public getUrlEvents(): Observable<any> {
    return this.urlEvents;
  }
}
