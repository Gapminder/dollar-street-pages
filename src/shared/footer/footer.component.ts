import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import {AppStates, StreetSettingsState} from '../../interfaces';
import { compact } from 'lodash';
import { FooterService } from './footer.service';
import {
  BrowserDetectionService,
  Angulartics2GoogleAnalytics,
  LanguageService,
  UtilsService
} from '../../common';
import { DrawDividersInterface } from '../../interfaces';

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
  public footerServiceSubscribe: Subscription;
  public routerEventsSubscribe: Subscription;
  public isDesktop: boolean;
  public streetSettingsState: Observable<StreetSettingsState>;
  public streetSettingsStateSubscription: Subscription;

  public constructor(private router: Router,
                     private footerService: FooterService,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>) {
    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
  }

  public ngOnInit(): void {
    this.isDesktop = this.browserDetectionService.isDesktop();

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (data) {
        if (data.streetSettings) {
          this.streetData = data.streetSettings;
        }
      }
    });

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

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
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
