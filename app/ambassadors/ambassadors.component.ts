import {Component, OnInit, OnDestroy,} from 'angular2/core';
import {HeaderWithoutSearchComponent} from '../common/headerWithoutSearch/header.component';
import {AmbassadorsListComponent} from './ambassadors-list/ambassadors-list.component';
import {FooterComponent} from '../common/footer/footer.component';
let tpl = require('./ambassadors.template.html');
let style = require('./ambassadors.css');

@Component({
  selector: 'ambassadors',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, AmbassadorsListComponent,FooterComponent]
})

export class AmbassadorsComponent implements OnInit,OnDestroy {
  private title:string;

  constructor() {
  }

  ngOnInit():void {
    this.title='Ambassadors'
  }


  ngOnDestroy() {
  }
}
