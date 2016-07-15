import { Component, OnInit, OnDestroy, Input, Inject, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';

let tpl = require('./photographer-profile.template.html');
let style = require('./photographer-profile.css');

@Component({
  selector: 'photographer-profile',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class PhotographerProfileComponent implements OnInit, OnDestroy {
  protected isShowInfo:boolean = false;

  @Input()
  private photographerId:string;
  @Output()
  private getPhotographer:EventEmitter<any> = new EventEmitter<any>();

  private photographer:any = {};
  private photographerProfileService:any;
  private math:any;
  private photographerProfileServiceSubscribe:any;

  public constructor(@Inject('PhotographerProfileService') photographerProfileService:any,
                     @Inject('Math') math:any) {
    this.photographerProfileService = photographerProfileService;
    this.math = math;
  }

  public ngOnInit():void {
    let query = `id=${this.photographerId}`;

    this.photographerProfileServiceSubscribe = this.photographerProfileService.getPhotographerProfile(query)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.photographer = res.data;
        this.getPhotographer.emit(`Photographer: ${this.photographer.firstName} ${this.photographer.lastName}`);
      });
  }

  public ngOnDestroy():void {
    this.photographerProfileServiceSubscribe.unsubscribe();
  }

  protected isShowInfoMore(photographer:any):boolean {
    return photographer.company ||
      photographer.description ||
      photographer.google ||
      photographer.facebook ||
      photographer.twitter ||
      photographer.linkedIn;
  }

  protected isShowDescription(company:any):boolean {
    return company && (company.name || company.link);
  }
}
