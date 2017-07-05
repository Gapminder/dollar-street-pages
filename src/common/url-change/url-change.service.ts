import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UrlChangeService {
  public location: Location;
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

  private isCurrentPathEqualTo(path: string, query: string): boolean {
    return this.location.isCurrentPathEqualTo(path, query);
  }

  public getUrlEvents(): Observable<any> {
    return this.urlEvents;
  }

  /*public parseUrl(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    if (query.regions) {
      query.regions = query.regions.split(',');
    }

    if (query.countries) {
      query.countries = query.countries.split(',');
    }

    return query;
  }

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }*/
}
