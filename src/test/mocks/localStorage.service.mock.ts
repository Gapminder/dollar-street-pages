import { Observable } from 'rxjs/Observable';
import { Subject } from  'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageServiceMock {
  public localStorage: Storage = localStorage;
  public itemEvents: Subject<any> = new Subject<any>();

  public setItem(key: string, value: string | boolean): void {
  }

  public removeItem(key: string): void {
  }

  public getItem(key: string): string {
    return null;
  }

  public getItemEvent(): Observable<{key: string, value: string}> {
    return Observable.of({key: null, value: null})
  }
}
