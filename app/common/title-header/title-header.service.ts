import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class TitleHeaderService {
  private title: string = '';
  private titleEvents: Subject<any>;

  public constructor() {
    this.titleEvents = new Subject<any>();
  }

  public setTitle(title: string): void {
    this.title = title;
    this.titleEvents.next({title: title});
  }

  public getTitle(): string {
    return this.title;
  }

  public getTitleEvent(): Observable<any> {
    return this.titleEvents;
  }
}
