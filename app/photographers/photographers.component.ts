import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { PhotographersFilter } from './photographers-filter.pipe.ts';
import { fromEvent } from 'rxjs/observable/fromEvent';

let tpl = require('./photographers.template.html');
let style = require('./photographers.css');

let device = require('device.js')();
const isDesktop: boolean = device.desktop();

@Component({
  selector: 'photographers',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES],
  pipes: [PhotographersFilter]
})

export class PhotographersComponent implements OnInit, OnDestroy {
  protected search: {text: string} = {text: ''};

  private math: any;
  private photographersByCountry: any[] = [];
  private photographersByName: any[] = [];
  private angulartics2GoogleAnalytics: any;
  private photographersService: any;
  private photographersServiceSubscribe: Subscription;
  private keyUpSubscribe: Subscription;
  private element: HTMLElement;
  private titleHeaderService: any;
  private loaderService: any;

  public constructor(element: ElementRef,
                     @Inject('Math') math: any,
                     @Inject('LoaderService') loaderService: any,
                     @Inject('TitleHeaderService') titleHeaderService: any,
                     @Inject('PhotographersService') photographersService: any,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics: any) {
    this.math = math;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.titleHeaderService = titleHeaderService;
    this.photographersService = photographersService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
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
