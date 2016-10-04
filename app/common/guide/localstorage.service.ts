import { Observable, Subject } from 'rxjs';

export class LocalStorageService {
  private localStorage: Storage = localStorage;
  private itemEvents: Subject<any> = new Subject<any>();

  public setItem(key: string, value: boolean): void {
    this.localStorage.setItem(key, value.toString());
    this.itemEvents.next({key: key, value: value});
  }

  public removeItem(key: string): void {
    this.localStorage.removeItem(key);
    this.itemEvents.next({key: key});
  }

  public getItem(key: string): boolean {
    return !Boolean(this.localStorage.getItem(key));
  }

  public getItemEvent(): Observable<{key: string, value: string}> {
    return this.itemEvents;
  }
}
