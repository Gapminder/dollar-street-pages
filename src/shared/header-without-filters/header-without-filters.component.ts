import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
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
import { AppStore } from '../../interfaces';
import { HeaderService } from '../header/header.service';
import {
  TitleHeaderService,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService
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
  public streetSettingsState: Observable<DrawDividersInterface>;
  public languages: any;

  public constructor(renderer: Renderer,
                     headerService: HeaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     store: Store<AppStore>,
                     private languageService: LanguageService) {
    this.renderer = renderer;
    this.headerService = headerService;
    this.device = browserDetectionService;
    this.titleHeaderService = titleHeaderService;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
  }

  public ngAfterViewInit(): any {
    this.rendererTitle(this.title);
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.title = this.titleHeaderService.getTitle();

    this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;
    });

    this.languageService.languagesList.subscribe((data: any) => {
      this.languages = data;
    });

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
