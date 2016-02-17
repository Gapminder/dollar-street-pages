import { Component, OnInit ,Inject} from 'angular2/core';

import {MatrixService} from './matrix.service';
import {MatrixImagesComponent} from './matrix.images.component/matrix.images.component';
import {StreetComponent} from '../common/street/street.component';
import {FooterComponent} from '../common/footer/footer.component';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

let _=require('lodash')

let tpl = require('./matrix.component.html');
let style = require('./matrix.component.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives:[MatrixImagesComponent,StreetComponent,FooterComponent]
})
export class MatrixComponent implements OnInit{
  public matrixService:MatrixService;
  public places:Subject<any>=new Subject();
  public chosenPlaces:Subject<any>=new Subject();
  public hoverPlace:Subject<any>=new Subject();
  constructor(@Inject(MatrixService) matrixService){
    this.matrixService=matrixService;
  }
  ngOnInit(): void {

    //this.places
    this.urlChanged();

   // setInterval(this.urlChanged.bind(this),5000)
      // .subscribe((res: any)=>{
      //   if(res.err){
      //     return res.err;
      //   }
      //   this.places=res.p
      // });

  }
  hoverPlaceS(place){
    this.hoverPlace.next(place)
  }

  urlChanged():void {
    console.log('start')
    this.matrixService.getMatrixImages(`thing=546ccf730f7ddf45c0179688&regions=World&countries=World`)
      .subscribe((val) => {
        this.places.next(val.places);
        let clonePlaces = _.cloneDeep(val.places);
        this.chosenPlaces.next(clonePlaces.splice((1 - 1) * 5, 5));
      });
  }
}
