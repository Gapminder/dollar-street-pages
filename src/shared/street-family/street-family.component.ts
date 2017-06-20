import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../ngrx/app.state';
import { AppEffects } from '../../ngrx/app.effects';
import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  DrawDividersInterface
} from '../../common';
import { StreetFamilyDrawService } from './street-family.service';

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
  public place: any;

  public window: Window = window;
  public street: any;
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
  public resizeSubscribe: Subscription;
  public streetBoxContainer: HTMLElement;
  public streetBoxContainerMargin: number;
  public store: Store<AppStateInterface>;

  public constructor(element: ElementRef,
                     streetDrawService: StreetFamilyDrawService,
                     store: Store<AppStateInterface>,
                     private appEffects: AppEffects) {
    this.element = element.nativeElement;
    this.street = streetDrawService;
    this.store = store;
  }

  public ngAfterViewInit(): void {
    this.streetBoxContainer = this.streetFamilyBoxContainer.nativeElement;
    this.street.setSvg = this.svg.nativeElement;

    let streetBoxContainerMarginLeft: string = this.window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');

    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

    this.appEffects.getDataOrDispatch(this.store, AppEffects.GET_STREET_SETTINGS).then((data: any) => {
      this.streetData = data;

      this.drawStreet(this.streetData, this.place);
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
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

    this.street.clearSvg();
  }

  public drawStreet(drawDividers: DrawDividersInterface, place: any): void {
    this.street
      .clearSvg()
      .init(drawDividers)
      .drawRoad()
      .drawHouse(place);
  }
}
