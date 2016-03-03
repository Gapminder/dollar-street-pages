import { Component, OnInit , Inject } from 'angular2/core';
import {
  RouterLink,
} from 'angular2/router';
import {PhotographersService} from './photographers.service';
import {PhotographersFilter} from './photographersFilter.pipe';

let tpl = require('./photographers.component.html');
let style = require('./photographers.component.css');

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives:[RouterLink],
  pipes: [PhotographersFilter]
})

export class PhotographersComponent implements OnInit{
  public photographersService:PhotographersService;
  public photographersByCountry:any[]=[];
  public photographersByName:any[]=[];
  private search:any = {text: ''};

  constructor(@Inject(PhotographersService) photographersService:any) {
    this.photographersService = photographersService;
  }

  ngOnInit(): void {
    this.photographersService.getPhotographers({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographersByCountry = res.data.photographers;
        this.photographersByName = res.data.allPhotographers;
      });
  }
}
