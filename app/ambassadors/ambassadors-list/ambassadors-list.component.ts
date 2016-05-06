import {Component, OnInit, Inject} from '@angular/core';

let tpl = require('./ambassadors-list.template.html');
let style = require('./ambassadors-list.css');

@Component({
  selector: 'ambassadors-list',
  template: tpl,
  styles: [style]
})

export class AmbassadorsListComponent implements OnInit {
  private ambassadorsListService:any;
  private ambassadorsList:any;
  private showedBlock:number;

  public constructor(@Inject('AmbassadorsListService') ambassadorsListService:any) {
    this.ambassadorsListService = ambassadorsListService;
  }

  public ngOnInit():void {
    this.ambassadorsListService.getAmbassadors({}).subscribe((res:any) => {
      if (res.err) {
        return res.err;
      }

      this.ambassadorsList = res.data;
    });
  }

  public show(i:number):void {
    if (this.showedBlock === i) {
      this.showedBlock = void 0;
      return;
    }

    this.showedBlock = i;
  }
}
