import {Component, OnInit, Inject} from 'angular2/core';

import {MatrixService} from './matrix.service';
import {MatrixImagesComponent} from './matrix.images.component/matrix.images.component';
import {FooterComponent} from '../common/footer/footer.component';
import {HeaderComponent} from '../common/header/header.component';

let tpl = require('./matrix.component.html');
let style = require('./matrix.component.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives: [HeaderComponent, MatrixImagesComponent, FooterComponent]
})

export class MatrixComponent implements OnInit {
  public matrixService:MatrixService;
  public places:any[] = [];

  constructor(@Inject(MatrixService) matrixService) {
    this.matrixService = matrixService;
  }

  ngOnInit():void {
    this.matrixService.getMatrixImages(`thing=546ccf730f7ddf45c0179688&regions=World&countries=World`)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.places = res.places;
      });
  }
}
