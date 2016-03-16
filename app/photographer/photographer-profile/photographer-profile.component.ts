import {Component, OnInit, Input Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {PhotographerProfileService} from './photographer-profile.service';

let tpl = require('./photographer-profile.template.html');
let style = require('./photographer-profile.css');

@Component({
  selector: 'photographer-profile',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class PhotographerProfileComponent implements OnInit {
  @Input()
  private photographerId:string;
  
  private photographer:any = {};
  private photographerProfileService:PhotographerProfileService;

  constructor(@Inject(PhotographerProfileService) photographerProfileService) {
    this.photographerProfileService = photographerProfileService;
  }

  ngOnInit():void {
    this.photographerProfileService.getPhotographerProfile(`id=${this.photographerId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.photographer = res.data;
      });
  }
}
