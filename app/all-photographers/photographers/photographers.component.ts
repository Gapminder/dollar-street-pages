import { Component, OnInit , Inject } from 'angular2/core';
import {
  RouterLink,
} from 'angular2/router';
import {PhotographersService} from './photographers.service';


let tpl = require('./photographers.component.html');
let style = require('./photographers.component.css');

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives:[RouterLink],
  providers: [PhotographersService]
})

export class PhotographersComponent implements OnInit{
  public photographersService:PhotographersService;
  public photographers:any[]=[];

  constructor(@Inject(PhotographersService) photographersService:any) {
    this.photographersService = photographersService;
  }

  ngOnInit(): void {
    this.photographersService.getPhotographers({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographers = res.photographers;
      });
  }
}
