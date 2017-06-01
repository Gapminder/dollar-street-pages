import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { compact } from 'lodash';
import { FooterService } from './footer.service';
import {
  StreetSettingsService,
  DrawDividersInterface,
  BrowserDetectionService,
  Angulartics2GoogleAnalytics,
  LanguageService,
  UtilsService
} from '../../common';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit, OnDestroy {
  public page: string;
  public footerData: any;
  public window: Window = window;
  public isMatrixComponent: boolean;
  public streetData: DrawDividersInterface;

  public router: Router;
  public footerService: FooterService;
  public utilsService: UtilsService;
  public footerServiceSubscribe: Subscription;
  public routerEventsSubscribe: Subscription;
  public streetServiceSubscribe: Subscription;
  public streetSettingsService: StreetSettingsService;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public device: BrowserDetectionService;
  public isDesktop: boolean;

  public languageService: LanguageService;

  public constructor(router: Router,
                     footerService: FooterService,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     languageService: LanguageService,
                     utilsService: UtilsService) {
    this.router = router;
    this.footerService = footerService;
    this.utilsService = utilsService;
    this.device = browserDetectionService;
    this.streetSettingsService = streetSettingsService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
  }

  public ngOnInit(): any {
    this.isDesktop = this.device.isDesktop();

    this.routerEventsSubscribe = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let activePage: string = event
          .urlAfterRedirects
          .split('?')
          .shift();

        this.isMatrixComponent = activePage === '/matrix';

        activePage = compact(activePage.split('/')).shift();

        if (activePage !== this.page) {
          document.body.classList.add(activePage);
          document.body.classList.remove(this.page);
        }

        this.page = activePage;
      }
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

    this.footerServiceSubscribe = this.footerService.getFooter(this.languageService.getLanguageParam())
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.footerData = val.data;
      });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.footerServiceSubscribe.unsubscribe();
  }

  public goToMatrixPage(): void {
    this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from footer', {});

    let queryParams: any = {
      thing: 'Families',
      countries: 'World',
      regions: 'World',
      zoom: 4,
      row: 1,
      lowIncome: this.streetData.poor,
      highIncome: this.streetData.rich
    };

    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin + this.window.location.pathname + '?' + this.objToQuery(queryParams);

      return;
    }

    if (!this.isDesktop) {
      queryParams.zoom = 3;
    }

    this.router.navigate(['/matrix'], {queryParams: queryParams});
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }
}
