import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { HeaderService } from '../header/header.service';
import {
  TitleHeaderService,
  StreetSettingsService,
  DrawDividersInterface,
  BrowserDetectionService
} from '../../common';
import { LanguageService } from '../../shared/language-selector/language.service';

@Component({
  selector: 'header-without-filters',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
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
  public streetServiceSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public streetSettingsService: StreetSettingsService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public languageService: LanguageService;

  public constructor(renderer: Renderer,
                     headerService: HeaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     streetSettingsService: StreetSettingsService,
                     languageService: LanguageService) {
    this.renderer = renderer;
    this.headerService = headerService;
    this.device = browserDetectionService;
    this.titleHeaderService = titleHeaderService;
    this.streetSettingsService = streetSettingsService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.title = this.titleHeaderService.getTitle();

    this.titleHeaderSubscribe = this.titleHeaderService
      .getTitleEvent()
      .subscribe((data: {title: string}) => {
        this.rendererTitle(data.title);
      });

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
      });
  }

  public ngOnDestroy(): void {
    this.titleHeaderSubscribe.unsubscribe();
  }

  public ngAfterViewInit(): any {
    this.rendererTitle(this.title);
  }

  public rendererTitle(title: string): void {
    this.renderer.setElementProperty(this.heading.nativeElement, 'innerHTML', title);
  }
}
