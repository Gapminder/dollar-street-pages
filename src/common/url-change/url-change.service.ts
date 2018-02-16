import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { UrlParameters } from "../../interfaces";

@Injectable()
export class UrlChangeService {
  private urlEvents: Subject<any>;

  public constructor(private location: Location) {
    this.urlEvents = new Subject();
  }

  public replaceState(path: string, query: string): void {
    if (this.isCurrentPathEqualTo(path, query)) {
      return;
    }

    this.location.replaceState(path, query);

    this.urlEvents.next('my event');
  }

  public assignState(path: string): void {
    this.location.go(path);
  }

  public goToUrl(path: string, query: string): void {
    if (this.isCurrentPathEqualTo(path, query)) {
      return;
    }

    this.location.go(path, query);

    this.urlEvents.next('my event');
  }

  private isCurrentPathEqualTo(path: string, query: string): boolean {
    return this.location.isCurrentPathEqualTo(path, query);
  }

  public getUrlEvents(): Observable<any> {
    return this.urlEvents;
  }
}
