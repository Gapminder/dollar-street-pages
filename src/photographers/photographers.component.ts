import {
  Component,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import {
  MathService,
  LoaderService,
  TitleHeaderService,
  BrowserDetectionService,
  LanguageService
} from '../common';
import { KeyCodes } from '../enums';

import { PhotographersService } from './photographers.service';

@Component({
  selector: 'photographers',
  templateUrl: './photographers.component.html',
  styleUrls: ['./photographers.component.css']
})
export class PhotographersComponent implements OnDestroy, AfterViewInit {
  @ViewChild('photographersSearch')
  public photographersSearch: ElementRef;

  public search: {text: string} = {text: ''};
  public photographersByCountry: any[] = [];
  public photographersByName: any[] = [];
  public photographersServiceSubscribe: Subscription;
  public keyUpSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;
  public element: HTMLElement;
  public isDesktop: boolean;

  public constructor(elementRef: ElementRef,
                     private math: MathService,
                     private loaderService: LoaderService,
                     private titleHeaderService: TitleHeaderService,
                     private browserDetectionService: BrowserDetectionService,
                     private photographersService: PhotographersService,
                     private languageService: LanguageService) {
    this.element = elementRef.nativeElement;
  }

  public ngAfterViewInit(): void {
    let searchInput = this.photographersSearch.nativeElement;

    this.keyUpSubscribe = fromEvent(searchInput, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        if (!this.isDesktop && e.keyCode === KeyCodes.enter) {
          searchInput.blur();
        }
      });

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.loaderService.setLoader(false);

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
