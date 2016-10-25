import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LoaderService, TitleHeaderService, BrowserDetectionService } from '../common';
import { PhotographersService } from './photographers.service';

@Component({
  selector: 'photographers',
  templateUrl: './photographers.component.html',
  styleUrls: ['./photographers.component.css']
})

export class PhotographersComponent implements OnInit, OnDestroy {
  protected search: {text: string} = {text: ''};

  private math: MathService;
  private photographersByCountry: any[] = [];
  private photographersByName: any[] = [];
  private photographersService: PhotographersService;
  private photographersServiceSubscribe: Subscription;
  private keyUpSubscribe: Subscription;
  private element: HTMLElement;
  private titleHeaderService: TitleHeaderService;
  private loaderService: LoaderService;
  private device: BrowserDetectionService;
  private isDesktop: boolean;

  public constructor(element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     photographersService: PhotographersService) {
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
    this.titleHeaderService.setTitle('Photographers');

    this.photographersServiceSubscribe = this.photographersService.getPhotographers()
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
    this.loaderService.setLoader(false);
  }

  public toggleLeftSide(e: Event): void {
    let element = e.target as HTMLElement;
    let parent = element.parentNode as HTMLElement;

    parent.classList.toggle('show');
  }
}
