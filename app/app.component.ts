import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from './common/loader/loader.service';

@Component({
  selector: 'consumer-app',
  templateUrl: './app.template.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, OnDestroy {
  private isLoader: boolean = false;
  private isVisibleHeader: boolean;
  private router: Router;
  private loaderService: LoaderService;
  private routerEventsSubscribe: Subscription;
  private loaderServiceSubscribe: Subscription;

  public constructor(router: Router,
                     loaderService: LoaderService) {
    this.router = router;
    this.loaderService = loaderService;
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
      }
    });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();
  }
}
