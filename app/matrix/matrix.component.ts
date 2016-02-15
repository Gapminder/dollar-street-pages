import { Component, OnInit ,Inject} from 'angular2/core';

import {MatrixService} from './matrix.service';
import {MatrixImagesComponent} from './matrix.images.component/matrix.images.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./matrix.component.html');
let style = require('./matrix.component.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives:[MatrixImagesComponent,FooterComponent]
})
export class MatrixComponent implements OnInit{
  public matrixService:MatrixService;
  public places:any[]=[];
  constructor(@Inject(MatrixService) matrixService){
    this.matrixService=matrixService;
    console.log(this.matrixService)
  }
  ngOnInit(): void {
    this.matrixService.getMatrixImages(`thing=546ccf730f7ddf45c0179688&regions=World&countries=World`)
      .subscribe((res)=>{
        if(res.err){
          return res.err;
        }
        this.places=res.places;
      });
  }
}
