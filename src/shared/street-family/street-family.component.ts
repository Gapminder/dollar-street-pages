import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Store } from '@ngrx/store';
import {
  AppStates,
  DrawDividersInterface,
  Place,
  StreetSettingsState
} from '../../interfaces';
import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { GetStreetSettings } from '../../common/street-settings/ngrx/street-settings.actions';
import { StreetFamilyDrawService } from './street-family.service';
import { DEBOUNCE_TIME } from '../../defaultState';

@Component({
  selector: 'street-family',
  templateUrl: './street-family.component.html',
  styleUrls: ['./street-family.component.css']
})
export class StreetFamilyComponent implements OnDestroy, AfterViewInit {
  @ViewChild('svg')
  public svg: ElementRef;
  @ViewChild('streetFamilyBoxContainer')
  public streetFamilyBoxContainer: ElementRef;

  @Input()
  public place: Place;

  public window: Window = window;
  public street: StreetFamilyDrawService;
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
  public resizeSubscribe: Subscription;
  public streetBoxContainer: HTMLElement;
  public streetBoxContainerMargin: number;
  public streetSettingsState: Observable<StreetSettingsState>;
  public streetSettingsStateSubscription: Subscription;

  public constructor(elementRef: ElementRef,
                     streetDrawService: StreetFamilyDrawService,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;
    this.street = streetDrawService;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
  }

  public ngAfterViewInit(): void {
    this.streetBoxContainer = this.streetFamilyBoxContainer.nativeElement;
    this.street.setSvg = this.svg.nativeElement;

    let streetBoxContainerMarginLeft: string = this.window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');

    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (!data || !data.streetSettings) {
        this.store.dispatch(new GetStreetSettings());
      } else {
        this.streetData = data.streetSettings;

        this.drawStreet(this.streetData, this.place);
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        if (!this.place) {
          return;
        }

        streetBoxContainerMarginLeft = window.getComputedStyle(this.streetBoxContainer)
          .getPropertyValue('margin-left');

        this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

        this.drawStreet(this.streetData, this.place);
      });
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    this.street.clearSvg();
  }

  public drawStreet(drawDividers: DrawDividersInterface, place: any): void {
    this.street
      .clearSvg()
      .init(drawDividers)
      .drawRoad(drawDividers)
      .drawHouse(place);
  }
}
