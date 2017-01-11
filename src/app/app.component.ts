import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../common';
import { LanguageService } from '../common';

@Component({
  selector: 'consumer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  public window: Window = window;
  public navigator: any = navigator;
  public isLoader: boolean = false;
  public isVisibleHeader: boolean;
  public router: Router;
  public routerEventsSubscribe: Subscription;
  public loaderServiceSubscribe: Subscription;

  public languageService: LanguageService;
  public loaderService: LoaderService;

  public constructor(router: Router,
                     languageService: LanguageService,
                     loaderService: LoaderService) {
    this.router = router;
    this.loaderService = loaderService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.loaderServiceSubscribe = this.loaderService
      .getLoaderEvent()
      .subscribe((data: {isLoaded: boolean}) => {
        this.isLoader = data.isLoaded;
      });

    this.routerEventsSubscribe = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let activePage: string = event
          .urlAfterRedirects
          .split('?')
          .shift();

        if (activePage !== '/matrix') {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        this.isVisibleHeader = !(activePage === '/matrix' || activePage === '/family' || activePage === '/map');

        this.languageService.updateLangInUrl();
      }
    });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();
  }
}
