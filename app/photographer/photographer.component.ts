import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { PhotographerProfileComponent } from './photographer-profile/photographer-profile.component';
import { PhotographerPlacesComponent } from './photographer-places/photographer-places.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./photographer.template.html');
let style = require('./photographer.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives: [
    HeaderWithoutSearchComponent,
    PhotographerProfileComponent,
    PhotographerPlacesComponent,
    FooterComponent,
    FooterSpaceDirective
  ]
})

export class PhotographerComponent implements OnInit, OnDestroy {
  protected photographerId: string;

  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: any;

  public constructor(@Inject(ActivatedRoute) activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;
  }

  public ngOnInit(): void {
    this.queryParamsSubscribe = this.activatedRoute.params
      .subscribe((params: any) => {
        this.photographerId = params.id;
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
  }
}
