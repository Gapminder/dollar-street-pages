import { Component, ViewEncapsulation, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { SocialFollowButtonsComponent } from '../social-follow-buttons/social-follow-buttons.component.ts';

let tpl = require('./footer.template.html');
let style = require('./footer.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, SocialFollowButtonsComponent],
  encapsulation: ViewEncapsulation.None
})

export class FooterComponent implements OnInit, OnDestroy {
  protected footerData: any = {};
  protected Angulartics2GoogleAnalytics:any;
  private footerService: any;
  private footerServiceSubscribe: Subscription;
  private window: Window = window;
  private isMatrixComponent: boolean;
  private router: Router;

  public constructor(@Inject('FooterService') footerService: any,
                     @Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
                     @Inject(Router) router: Router,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any) {
    this.footerService = footerService;
    this.isMatrixComponent = activatedRoute.snapshot.url[0].path === 'matrix';
    this.router = router;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
  }

  public ngOnInit(): any {
    this.footerServiceSubscribe = this.footerService.getFooter()
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.footerData = val.data;
      });
  }

  public ngOnDestroy(): void {
    this.footerServiceSubscribe.unsubscribe();
  }

  protected goToMatrixPage(): void {
    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;
      this.Angulartics2GoogleAnalytics.eventTrack(`Go to Matrix page from footer `);

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();

    this.animateScroll('scrollBackToTop', 20, 1000);
  };

  private animateScroll(id: string, inc: number, duration: number): any {
    const elem = document.getElementById(id);
    const startScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;

    window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  private goToScroll(step: number, duration: number, inc: number): any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }

      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  private incScrollTop(step: number): void {
    if (document.body.scrollTop) {
      document.body.scrollTop += step;
    } else {
      document.documentElement.scrollTop += step;
    }
  }
}
