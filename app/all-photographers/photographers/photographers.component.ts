import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { PhotographersFilter } from './photographers-filter.pipe.ts';
import { LoaderComponent } from '../../common/loader/loader.component';
import { fromEvent } from 'rxjs/observable/fromEvent';

let tpl = require('./photographers.template.html');
let style = require('./photographers.css');

let device = require('device.js')();
const isDesktop: boolean = device.desktop();

@Component({
  selector: 'photographers-list',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, LoaderComponent],
  pipes: [PhotographersFilter]
})

export class PhotographersComponent implements OnInit, OnDestroy {
  protected math: any;
  protected photographersByCountry: any[];
  protected photographersByName: any[];
  protected Angulartics2GoogleAnalytics: any;
  private photographersService: any;
  private search: any;
  private loader: boolean;
  private photographersServiceSubscribe: Subscription;
  private keyUpSubscribe: Subscription;
  private element: HTMLElement;

  public constructor(element: ElementRef,
                     @Inject('PhotographersService') photographersService: any,
                     @Inject('Math') math: any,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any) {
    this.photographersService = photographersService;
    this.photographersByCountry = [];
    this.photographersByName = [];
    this.math = math;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
    this.search = {text: ''};
    this.loader = false;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    let searchInput = this.element.querySelector('#search') as HTMLInputElement;

    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.photographersServiceSubscribe = this.photographersService.getPhotographers()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.photographersByCountry = res.data.countryList;
        this.photographersByName = res.data.photographersList;
        this.loader = true;
      });

    this.keyUpSubscribe = fromEvent(searchInput, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        if (!isDesktop && e.keyCode === 13) {
          searchInput.blur();
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.keyUpSubscribe) {
      this.keyUpSubscribe.unsubscribe();
    }

    this.photographersServiceSubscribe.unsubscribe();
  }

  public toggleLeftSide(e: Event): void {
    let element = e.target as HTMLElement;
    let parent = element.parentNode as HTMLElement;
    parent.classList.toggle('show');
  }
}
