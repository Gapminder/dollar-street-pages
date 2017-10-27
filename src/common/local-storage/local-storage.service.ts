import { Observable } from 'rxjs/Observable';
import { Subject } from  'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  public localStorage: Storage = localStorage;
  public itemEvents: Subject<any> = new Subject<any>();

  public setItem(key: string, value: string | boolean): void {
    this.localStorage.setItem(key, value.toString());
    this.itemEvents.next({key: key, value: value});
  }

  public removeItem(key: string): void {
    this.localStorage.removeItem(key);
    this.itemEvents.next({key: key});
  }

  public getItem(key: string): string {
    return this.localStorage.getItem(key);
  }

  public getItemEvent(): Observable<{key: string, value: string}> {
    return this.itemEvents;
  }
}
