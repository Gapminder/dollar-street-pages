import {Component, OnInit, OnDestroy, Inject} from 'angular2/core';
import {AmbassadorsListService} from './ambassadors-list.service';
let tpl = require('./ambassadors-list.template.html');
let style = require('./ambassadors-list.css');

@Component({
  selector: 'ambassadors-list',
  template: tpl,
  styles: [style]
})

export class AmbassadorsListComponent implements OnInit,OnDestroy {
  private ambassadorsListService:AmbassadorsListService;
  private ambassadorsList:any;
  private showedBlock:number;

  constructor(@Inject(AmbassadorsListService) ambassadorsListService) {
    this.ambassadorsListService = ambassadorsListService;
  }

  ngOnInit():void {
    this.ambassadorsListService.getAmbassadors({}).subscribe((data)=> {
      this.ambassadorsList = data;
    })
  }


  ngOnDestroy() {
  }


  show(i:number) {
    if (this.showedBlock === i) {
      this.showedBlock = null;
      return
    }
    this.showedBlock = i;
  }
}
