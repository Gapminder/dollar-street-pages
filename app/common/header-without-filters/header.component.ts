import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { HeaderService } from '../header/header.service';
import { TitleHeaderService } from '../../common/title-header/title-header.service';
import { StreetSettingsService, DrawDividersInterface } from '../street/street.settings.service';
import { BrowserDetectionService } from '../browser-detection/browser-detection.service';

@Component({
  selector: 'header-without-filters',
  templateUrl: './header.template.html',
  styleUrls: ['./header.css']
})

export class HeaderWithoutFiltersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heading')
  private heading: ElementRef;

  private title: string;
  private defaultThing: any;
  private renderer: Renderer;
  private headerService: HeaderService;
  private streetData: DrawDividersInterface;
  private titleHeaderSubscribe: Subscription;
  private headerServiceSubscribe: Subscription;
  private streetServiceSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;
  private streetSettingsService: StreetSettingsService;
  private device: BrowserDetectionService;
  private isDesktop: boolean;

  public constructor(renderer: Renderer,
                     headerService: HeaderService,
                     titleHeaderService: TitleHeaderService,
                     browserDetectionService: BrowserDetectionService,
                     streetSettingsService: StreetSettingsService) {
    this.renderer = renderer;
    this.headerService = headerService;
    this.device = browserDetectionService;
    this.titleHeaderService = titleHeaderService;
    this.streetSettingsService = streetSettingsService;
  }

  public ngOnInit(): void {
    this.isDesktop = this.device.isDesktop();

    this.headerServiceSubscribe = this.headerService
      .getDefaultThing()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.defaultThing = res.data;
      });

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
    this.headerServiceSubscribe.unsubscribe();
  }

  public ngAfterViewInit(): any {
    this.rendererTitle(this.title);
  }

  private rendererTitle(title: string): void {
    this.renderer.setElementProperty(this.heading.nativeElement, 'innerHTML', title);
  }
}
