import 'rxjs/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  DrawDividersInterface,
  LanguageService
} from '../../common';
import { GetStreetSettings } from '../../common/street/ngrx/street-settings.actions';
import { StreetPinnedDrawService } from './street-pinned.service';

@Component({
  selector: 'street-pinned',
  templateUrl: './street-pinned.component.html',
  styleUrls: ['./street-pinned.component.css']
})
export class StreetPinnedComponent implements OnDestroy, AfterViewInit {
  @ViewChild('svg')
  public svg: ElementRef;
  @ViewChild('streetPinnedBoxContainer')
  public streetPinnedBoxContainer: ElementRef;

  @Input()
  public places: any;
  @Input()
  public hoverPlace: Subject<any>;

  public window: Window = window;
  public street: any;
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
  public resizeSubscribe: Subscription;
  public streetBoxContainer: HTMLElement;
  public streetBoxContainerMargin: number;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public streetSettingsStateSubscription: Subscription;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public getTranslationSubscription: Subscription;
  public hoverPlaceSubscribe: Subscription;

  public constructor(element: ElementRef,
                     streetDrawService: StreetPinnedDrawService,
                     private store: Store<AppStates>,
                     private languageService: LanguageService) {
    this.element = element.nativeElement;
    this.street = streetDrawService;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngAfterViewInit(): void {
    this.streetBoxContainer = this.streetPinnedBoxContainer.nativeElement;
    this.street.setSvg = this.svg.nativeElement;

    let streetBoxContainerMarginLeft: string = this.window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');

    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

    this.getTranslationSubscription = this.languageService.getTranslation(['POOREST', 'RICHEST']).subscribe((trans: any) => {
      this.street.poorest = trans.POOREST.toUpperCase();
      this.street.richest = trans.RICHEST.toUpperCase();
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (!data || !data.streetSettings) {
        this.store.dispatch(new GetStreetSettings());
      } else {
        if (!this.places) {
          //return;
        }

        this.streetData = data.streetSettings;

        this.drawStreet(this.streetData, this.places);
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.placesSet && this.streetData) {
          this.drawStreet(this.streetData, data.placesSet);
        }
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        if (!this.places) {
          return;
        }

        streetBoxContainerMarginLeft = window.getComputedStyle(this.streetBoxContainer).getPropertyValue('margin-left');

        this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

        this.drawStreet(this.streetData, this.places);
      });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe((hoverPlace: any): void => {
      if (!hoverPlace) {
        this.street.removeHouses('hover');

        this.street.drawHouses(this.places);

        return;
      }

//      console.log(this.places);
      this.street.drawHouses(this.places);
      this.street.drawHoverHouse(hoverPlace);
    });
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
    }

    if (this.getTranslationSubscription) {
      this.getTranslationSubscription.unsubscribe();
    }

    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }

    this.street.clearSvg();
  }

  public drawStreet(drawDividers: DrawDividersInterface, places: any): void {
    this.street
      .clearSvg()
      .init(drawDividers)
      .drawRoad();

    if (places) {
      this.street.drawHouses(places);
    }
  }
}
