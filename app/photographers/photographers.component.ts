import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { MathService } from '../common/math-service/math-service';
import { LoaderService } from '../common/loader/loader.service';
import { TitleHeaderService } from '../common/title-header/title-header.service';
import { PhotographersService } from './photographers.service';

let tpl = require('./photographers.template.html');
let style = require('./photographers.css');

let device = require('device.js')();
const isDesktop: boolean = device.desktop();

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style]
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

  public constructor(element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     photographersService: PhotographersService) {
    this.math = math;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.titleHeaderService = titleHeaderService;
    this.photographersService = photographersService;
  }

  public ngOnInit(): void {
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
        if (!isDesktop && e.keyCode === 13) {
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
