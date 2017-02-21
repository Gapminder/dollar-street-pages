import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LoaderService, TitleHeaderService, BrowserDetectionService, LanguageService } from '../common';
import { PhotographersService } from './photographers.service';

@Component({
  selector: 'photographers',
  templateUrl: './photographers.component.html',
  styleUrls: ['./photographers.component.css']
})

export class PhotographersComponent implements OnInit, OnDestroy {
  public search: {text: string} = {text: ''};
  public math: MathService;
  public photographersByCountry: any[] = [];
  public photographersByName: any[] = [];
  public photographersService: PhotographersService;
  public photographersServiceSubscribe: Subscription;
  public keyUpSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;
  public element: HTMLElement;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public languageService: LanguageService;

  public constructor(element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     photographersService: PhotographersService,
                     languageService: LanguageService) {
    this.math = math;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.titleHeaderService = titleHeaderService;
    this.photographersService = photographersService;
    this.device = browserDetectionService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.loaderService.setLoader(false);
    let searchInput = this.element.querySelector('#search') as HTMLInputElement;

    this.getTranslationSubscribe = this.languageService.getTranslation('PHOTOGRAPHERS').subscribe((trans: any) => {
      this.titleHeaderService.setTitle(trans);
    });

    this.photographersServiceSubscribe = this.photographersService.getPhotographers(this.languageService.getLanguageParam())
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
    this.keyUpSubscribe.unsubscribe();
    this.photographersServiceSubscribe.unsubscribe();
    this.getTranslationSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }

  public toggleLeftSide(e: Event): void {
    let element = e.target as HTMLElement;
    let parent = element.parentNode as HTMLElement;

    parent.classList.toggle('show');
  }
}
