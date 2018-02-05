import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UrlChangeServiceMock {
  private urlEvents: Subject<any> = new Subject();
  private location: Location;

  public replaceState(path: string, query: string): void {
  }

  public goToUrl(path: string, query: string): void {

  }

  private isCurrentPathEqualTo(path: string, query: string): boolean {
    return true;
  }

  public getUrlEvents(): Observable<any> {
    return Observable.of(null);
  }
}
