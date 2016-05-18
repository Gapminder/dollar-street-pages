import {Component, OnInit, OnDestroy, NgZone, Inject} from '@angular/core';
import {fromEvent} from 'rxjs/observable/fromEvent';

let tpl = require('./ambassadors-list.template.html');
let style = require('./ambassadors-list.css');

@Component({
  selector: 'ambassadors-list',
  template: tpl,
  styles: [style]
})

export class AmbassadorsListComponent implements OnInit, OnDestroy {
  private ambassadorsListService:any;
  private ambassadorsListSubscribe:any;
  private ambassadorsList:any;
  private showedBlock:number;
  private resizeSubscribe:any;
  private zone:NgZone;
  private columnsRow:number = 6;

  public constructor(@Inject('AmbassadorsListService') ambassadorsListService:any, @Inject(NgZone) zone:NgZone) {
    this.ambassadorsListService = ambassadorsListService;
    this.zone = zone;
  }

  public ngOnInit():void {
    this.ambassadorsListSubscribe = this.ambassadorsListService.getAmbassadors({}).subscribe((res:any) => {
      if (res.err) {
        return res.err;
      }

      this.ambassadorsList = res.data;
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          let windowInnerWidth = window.innerWidth;

          if (windowInnerWidth < 1024) {
            this.columnsRow = 4;
          } else if (windowInnerWidth < 601) {
            this.columnsRow = 2;
          } else {
            this.columnsRow = 6;
          }
        });
      });
  }

  public ngOnDestroy():void {
    this.ambassadorsListSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();
  }

  public show(i:number):void {
    if (this.showedBlock === i) {
      this.showedBlock = void 0;
      return;
    }

    this.showedBlock = i;
  }
}
