import { Component, OnInit, OnDestroy, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
let tpl = require('./photographer-profile.template.html');
let style = require('./photographer-profile.css');

@Component({
  selector: 'photographer-profile',
  template: tpl,
  styles: [style]
})

export class PhotographerProfileComponent implements OnInit, OnDestroy {
  protected isShowInfo: boolean = false;
  protected math: any;
  protected Angulartics2GoogleAnalytics: any;
  @Input()
  private photographerId: string;
  @Output()
  private getPhotographer: EventEmitter<any> = new EventEmitter<any>();

  private photographer: {firstName?: string, lastName?: string} = {};
  private photographerProfileService: any;
  private photographerProfileServiceSubscribe: Subscription;

  public constructor(@Inject('PhotographerProfileService') photographerProfileService: any,
                     @Inject('Math') math: any,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any) {
    this.photographerProfileService = photographerProfileService;
    this.math = math;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
  }

  public ngOnInit(): void {
    let query = `id=${this.photographerId}`;

    this.photographerProfileServiceSubscribe = this.photographerProfileService.getPhotographerProfile(query)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.photographer = res.data;
        this.getPhotographer.emit(`<span class="sub-title">Photographer:</span> ${this.photographer.firstName} ${this.photographer.lastName}`);
      });
  }

  public ngOnDestroy(): void {
    this.photographerProfileServiceSubscribe.unsubscribe();
  }

  protected isShowInfoMore(photographer: any): boolean {
    return photographer.company ||
      photographer.description ||
      photographer.google ||
      photographer.facebook ||
      photographer.twitter ||
      photographer.linkedIn;
  }
}
