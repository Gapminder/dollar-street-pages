import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MathService } from '../../common';
import { PhotographerProfileService } from './photographer-profile.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'photographer-profile',
  templateUrl: './photographer-profile.component.html',
  styleUrls: ['./photographer-profile.component.css']
})

export class PhotographerProfileComponent implements OnInit, OnDestroy {
  public translate: TranslateService;
  public photographerTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetPhotographerSubscribe: Subscription;

  protected isShowInfo: boolean = false;

  @Input()
  private photographerId: string;
  @Output()
  private getPhotographer: EventEmitter<any> = new EventEmitter<any>();

  private math: MathService;
  private photographer: {firstName?: string, lastName?: string} = {};
  private photographerProfileServiceSubscribe: Subscription;
  private photographerProfileService: PhotographerProfileService;

  public constructor(math: MathService,
                     photographerProfileService: PhotographerProfileService,
                     translate: TranslateService) {
    this.translate = translate;
    this.photographerProfileService = photographerProfileService;
    this.math = math;
  }

  public ngOnInit(): void {
    let query = `id=${this.photographerId}`;

    this.translateGetPhotographerSubscribe = this.translate.get('PHOTOGRAPHER').subscribe((res: any) => {
      this.photographerTranslate = res;
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const photographerTranslation = event.translations;
      /* tslint:disable:no-string-literal */
      this.photographerTranslate = photographerTranslation['PHOTOGRAPHER'];
      /* tslint:enable:no-string-literal */

      if (this.getPhotographer) {
        this.getPhotographer
          .emit(`<span class="sub-title">${this.photographerTranslate}:</span> ${this.photographer.firstName} ${this.photographer.lastName}`);
      }
    });

    this.photographerProfileServiceSubscribe = this.photographerProfileService.getPhotographerProfile(query)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.photographer = res.data;
        this.getPhotographer
          .emit(`<span class="sub-title">${this.photographerTranslate}:</span> ${this.photographer.firstName} ${this.photographer.lastName}`);
      });
  }

  public ngOnDestroy(): void {
    this.photographerProfileServiceSubscribe.unsubscribe();
    this.translateOnLangChangeSubscribe.unsubscribe();
    this.translateGetPhotographerSubscribe.unsubscribe();
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
