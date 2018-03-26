import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStates, LanguageState, StreetSettingsState } from '../../interfaces';
import { compact } from 'lodash';
import { FooterService } from './footer.service';
import {
  BrowserDetectionService,
  Angulartics2GoogleAnalytics,
  LanguageService,
  UtilsService
} from '../../common';
import { DrawDividersInterface } from '../../interfaces';
import { get, forEach } from 'lodash';
import { DEBOUNCE_TIME } from '../../defaultState';

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
  public isDesktop: boolean;
  ngSubscriptions: { [key: string]: Subscription} = {};
  language: string;

  public constructor(private router: Router,
                     private footerService: FooterService,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>) {
  }

  public ngOnInit(): void {
    this.isDesktop = this.browserDetectionService.isDesktop();

    this.ngSubscriptions.streetSettings = this.store
      .select((appStates: AppStates) => appStates.streetSettings)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((data: StreetSettingsState) => {
      if (data) {
        if (data.streetSettings) {
          this.streetData = data.streetSettings;
        }
      }
    });

    this.ngSubscriptions.routerEvents = this.router.events.subscribe((event: any) => {
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

    this.updateTranslation();

    this.ngSubscriptions.languageStore = this.store
      .select((state: AppStates) => state.language)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe( (state: LanguageState) => {

        this.updateTranslation();
      });

  }

  updateTranslation(): void {
    const language = this.languageService.getLanguageParam();
    if ( this.language === language) {
      return;
    }
    this.language = language;

    if (get(this.ngSubscriptions, 'footerTranslation', false)) {
      this.ngSubscriptions.footerTranslation.unsubscribe();
    }

    this.ngSubscriptions.footerTranslation = this.footerService.getFooter(this.languageService.getLanguageParam())
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.footerData = val.data;
      });
  }

  public ngOnDestroy(): void {
    forEach(this.ngSubscriptions, (value, key) => {
      value.unsubscribe();
    });
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
