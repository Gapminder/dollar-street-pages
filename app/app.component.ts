import { Component, ViewEncapsulation, OnInit, OnDestroy, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { FooterComponent } from './common/footer/footer.component';
import { FloatFooterComponent } from './common/footer-floating/footer-floating.component';
import { FooterSpaceDirective } from './common/footer-space/footer-space.directive';
import { HeaderWithoutFiltersComponent } from './common/header-without-filters/header.component';
import { LoaderComponent } from './common/loader/loader.component';
import { LoaderService } from './common/loader/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'consumer-app',
  template: require('./app.template.html') as string,
  styles: [require('./app.css') as string],
  providers: [Angulartics2GoogleAnalytics],
  directives: [
    ROUTER_DIRECTIVES,
    HeaderWithoutFiltersComponent,
    FooterComponent,
    FloatFooterComponent,
    FooterSpaceDirective,
    LoaderComponent
  ],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, OnDestroy {
  private isLoaderd: boolean = false;
  private isVisibleHeader: boolean;
  private router: Router;
  private angulartics2: Angulartics2;
  private loaderService: LoaderService;
  private routerEventsSubscribe: Subscription;
  private loaderServiceSubscribe: Subscription;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;

  public constructor(router: Router,
                     angulartics2: Angulartics2,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     @Inject('LoaderService') loaderService: LoaderService) {
    this.router = router;
    this.angulartics2 = angulartics2;
    this.loaderService = loaderService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  public ngOnInit(): void {
    this.loaderServiceSubscribe = this.loaderService
      .getLoaderEvent()
      .subscribe((data: {isLoaded: boolean}) => {
        this.isLoaderd = data.isLoaded;
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
      }
    });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();
  }
}
