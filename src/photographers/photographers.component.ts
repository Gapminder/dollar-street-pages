import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LoaderService, TitleHeaderService, BrowserDetectionService } from '../common';
import { PhotographersService } from './photographers.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'photographers',
  templateUrl: './photographers.component.html',
  styleUrls: ['./photographers.component.css']
})

export class PhotographersComponent implements OnInit, OnDestroy {
  public search: {text: string} = {text: ''};
  public translate: TranslateService;
  public photographersTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetPhotographersSubscribe: Subscription;

  public math: MathService;
  public photographersByCountry: any[] = [];
  public photographersByName: any[] = [];
  public photographersService: PhotographersService;
  public photographersServiceSubscribe: Subscription;
  public keyUpSubscribe: Subscription;
  public element: HTMLElement;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public getLanguage: string = 'fr';

  public constructor(element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     photographersService: PhotographersService,
                     translate: TranslateService) {
    this.translate = translate;
    this.math = math;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.titleHeaderService = titleHeaderService;
    this.photographersService = photographersService;
    this.device = browserDetectionService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.loaderService.setLoader(false);
    let searchInput = this.element.querySelector('#search') as HTMLInputElement;

    this.translateGetPhotographersSubscribe = this.translate.get('PHOTOGRAPHERS').subscribe((res: any) => {
      this.photographersTranslate = res;
      this.titleHeaderService.setTitle(this.photographersTranslate);
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const photographersTranslation = event.translations;
      this.photographersTranslate = photographersTranslation.PHOTOGRAPHERS;
      this.titleHeaderService.setTitle(this.photographersTranslate);
    });

    this.photographersServiceSubscribe = this.photographersService.getPhotographers(`lang=${this.getLanguage}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.photographersByCountry = res.data.countryList;
        this.photographersByName = res.data.photographersList;
        this.loaderService.setLoader(true);
      });

    this.keyUpSubscribe = fromEvent(searchInput, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        if (!this.isDesktop && e.keyCode === 13) {
          searchInput.blur();
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }

    if (this.translateGetPhotographersSubscribe.unsubscribe) {
      this.translateGetPhotographersSubscribe.unsubscribe();
    }

    this.keyUpSubscribe.unsubscribe();
    this.photographersServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }

  public toggleLeftSide(e: Event): void {
    let element = e.target as HTMLElement;
    let parent = element.parentNode as HTMLElement;

    parent.classList.toggle('show');
  }
}
