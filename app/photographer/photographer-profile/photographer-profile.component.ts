<<<<<<< HEAD
import {Component, OnInit, OnDestroy, Input Inject} from 'angular2/core';
=======
import {Component, OnInit,OnDestroy, Input, Inject} from 'angular2/core';
>>>>>>> feat(component): add country component
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

export class PhotographerProfileComponent implements OnInit,OnDestroy {
  @Input()
  private photographerId:string;

  private photographer:any = {};
  private photographerProfileService:PhotographerProfileService;
  private photographerProfileServiceSubscribe:any;
  private isShowInfo:boolean = false;

  constructor(@Inject(PhotographerProfileService) photographerProfileService) {
    this.photographerProfileService = photographerProfileService;
  }

  ngOnInit():void {
    let query = `id=${this.photographerId}`;

    this.photographerProfileServiceSubscribe = this.photographerProfileService.getPhotographerProfile(query)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.photographer = res.data;
      });
  }

  ngOnDestroy():void {
    this.photographerProfileServiceSubscribe.unsubscribe()
  }

  isShowInfoMore(photographer:any):boolean {
    return photographer.company ||
      photographer.description ||
      photographer.google ||
      photographer.facebook ||
      photographer.twitter ||
      photographer.linkedIn;
  }
}
