import { Component, OnInit , Inject } from 'angular2/core';
import {
  RouterLink,
} from 'angular2/router';
import {PhotographerService} from './photographer.photographer.service';


let tpl = require('./photographer.photographer.component.html');
let style = require('./photographer.photographer.component.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives:[RouterLink],
  providers: [PhotographerService]
})

export class PhotographerPhotographerComponent implements OnInit{
  public photographerService:PhotographerService;
  public photographer:any[]=[];

  constructor(@Inject(PhotographerService) photographerService:any) {
    this.photographerService = photographerService;
  }

  ngOnInit(): void {
    this.photographerService.getPhotographer({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographer = res.photographer;
      });
  }
}
