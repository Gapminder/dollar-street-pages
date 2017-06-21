import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '../../app/app.store';
import { HeaderService } from '../header/header.service';
import {
  TitleHeaderService,
  DrawDividersInterface,
  BrowserDetectionService
} from '../../common';

@Component({
  selector: 'header-without-filters',
  templateUrl: './header-without-filters.component.html',
  styleUrls: ['./header-without-filters.component.css']
})

export class HeaderWithoutFiltersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heading') public heading: ElementRef;

  public title: string;
  public defaultThing: any;
  public renderer: Renderer;
  public headerService: HeaderService;
  public streetData: DrawDividersInterface;
  public titleHeaderSubscribe: Subscription;
  public headerServiceSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public store: Store<AppStore>;

  public constructor(renderer: Renderer,
                     headerService: HeaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     store: Store<AppStore>) {
    this.renderer = renderer;
    this.headerService = headerService;
    this.device = browserDetectionService;
    this.titleHeaderService = titleHeaderService;
    this.store = store;
  }

  public ngAfterViewInit(): any {
    this.rendererTitle(this.title);
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.title = this.titleHeaderService.getTitle();

    /*this.appEffects.getDataOrDispatch(this.store, AppEffects.GET_STREET_SETTINGS).then((data: any) => {
      this.streetData = data;
    });*/

    this.titleHeaderSubscribe = this.titleHeaderService
      .getTitleEvent()
      .subscribe((data: {title: string}) => {
        this.rendererTitle(data.title);
      });
  }

  public ngOnDestroy(): void {
    this.titleHeaderSubscribe.unsubscribe();
  }

  public rendererTitle(title: string): void {
    this.renderer.setElementProperty(this.heading.nativeElement, 'innerHTML', title);
  }
}
