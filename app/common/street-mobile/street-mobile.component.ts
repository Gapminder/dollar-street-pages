import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { sortBy, chain } from 'lodash';
import { StreetSettingsService } from '../street/street.settings.service';
import { StreetMobileDrawService } from './street-mobile.service';

let tpl = require('./street-mobile.template.html');
let style = require('./street-mobile.css');

@Component({
  selector: 'street-mobile',
  template: tpl,
  styles: [style]
})

export class StreetMobileComponent implements OnInit, OnDestroy {
  @Input('places')
  private places: Observable<any>;

  private street: any;
  private streetSettingsService: StreetSettingsService;
  private streetData: any;
  private element: HTMLElement;
  private streetServiceSubscribe: Subscription;
  private resizeSubscribe: Subscription;
  private windowInnerWidth: number = window.innerWidth;

  private placesSubscribe: Subscription;
  private placesArr: any;

  public constructor(element: ElementRef,
                     streetSettingsService: StreetSettingsService,
                     streetDrawService: StreetMobileDrawService) {
    this.element = element.nativeElement;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
  }

  public ngOnInit(): any {
    this.street.setSvg = this.element.querySelector('.street-box svg') as SVGElement;
    this.street.set('isInit', true);

    this.placesSubscribe = this.places && this.places
        .subscribe((places: any): void => {
          this.placesArr = places;

          if (!this.streetData) {
            return;
          }

          this.setDividers(this.placesArr);
        });

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;

        if (!this.placesArr) {
          return;
        }

        this.setDividers(this.placesArr);
      });

    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        if (!this.street.places || this.windowInnerWidth === window.innerWidth) {
          return;
        }

        this.setDividers(this.placesArr);
      });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();

    if (this.placesSubscribe) {
      this.placesSubscribe.unsubscribe();
    }

    this.streetServiceSubscribe.unsubscribe();
  }

  private setDividers(places: any): void {
    this.street
      .clearSvg()
      .init(this.streetData)
      .set('places', sortBy(places, 'income'))
      .set('fullIncomeArr', chain(this.street.places)
        .sortBy('income')
        .map((place: any) => {
          if (!place) {
            return void 0;
          }

          return this.street.scale(place.income);
        })
        .compact()
        .value())
      .drawScale(places);
  }
}
