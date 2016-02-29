import { Component, OnInit , Inject } from 'angular2/core';
import {
  RouterLink,
} from 'angular2/router';
import {PhotographerProfileService} from './photographer-profile.service';


let tpl = require('./photographer-profile.template.html');
let style = require('./photographer-profile.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives:[RouterLink],
  providers: [PhotographerProfileService]
})

export class PhotographerProfileComponent implements OnInit{
  public photographerProfileService:PhotographerProfileService;
  public photographer:any[]=[];

  constructor(@Inject(PhotographerProfileService) photographerProfileService:any) {
    this.photographerProfileService = photographerProfileService;
  }

  ngOnInit(): void {
    this.photographerProfileService.getPhotographer({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.photographer = res.photographer;
      });
  }
}
