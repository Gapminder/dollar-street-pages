import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  StreetSettingsService,
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
  public streetSettingsService: StreetSettingsService;
  public streetData: DrawDividersInterface;
  public element: HTMLElement;
  public streetServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public streetBoxContainer: HTMLElement;
  public streetBoxContainerMargin: number;

  public constructor(element: ElementRef,
                     streetSettingsService: StreetSettingsService,
                     streetDrawService: StreetFamilyDrawService) {
    this.element = element.nativeElement;
    this.street = streetDrawService;
    this.streetSettingsService = streetSettingsService;
  }

  public ngAfterViewInit(): void {
    this.streetBoxContainer = this.streetFamilyBoxContainer.nativeElement;
    this.street.setSvg = this.svg.nativeElement;

    let streetBoxContainerMarginLeft: string = this.window.getComputedStyle(this.streetBoxContainer)
      .getPropertyValue('margin-left');

    this.streetBoxContainerMargin = parseFloat(streetBoxContainerMarginLeft) * 2;

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

    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;

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
