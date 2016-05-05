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

  constructor(@Inject('AmbassadorsListService') ambassadorsListService) {
    this.ambassadorsListService = ambassadorsListService;
  }

  ngOnInit():void {
    this.ambassadorsListService.getAmbassadors({}).subscribe((res) => {
      if (res.err) {
        return res.err;
      }

      this.ambassadorsList = res.data;
    });
  }

  show(i:number) {
    if (this.showedBlock === i) {
      this.showedBlock = null;

      return;
    }

    this.showedBlock = i;
  }
}
