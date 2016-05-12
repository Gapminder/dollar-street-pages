import {Component, OnInit, OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

let tpl = require('./photographer-profile.template.html');
let style = require('./photographer-profile.css');

@Component({
  selector: 'photographer-profile',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class PhotographerProfileComponent implements OnInit, OnDestroy {
  @Input()
  private photographerId:string;

  private photographer:any = {};
  private photographerProfileService:any;
  private photographerProfileServiceSubscribe:any;
  private isShowInfo:boolean = false;

  constructor(@Inject('PhotographerProfileService') photographerProfileService) {
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
    this.photographerProfileServiceSubscribe.unsubscribe();
  }

  isShowInfoMore(photographer:any):boolean {
    return photographer.company ||
      photographer.description ||
      photographer.google ||
      photographer.facebook ||
      photographer.twitter ||
      photographer.linkedIn;
  }

  isShowDescription(company:any):boolean {
    return company && (company.name || company.link);
  }
}
