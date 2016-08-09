import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { CountryInfoComponent } from './country-info/country-info.component';
import { CountryPlacesComponent } from './country-places/country-places.component.ts';
import { FooterComponent } from '../common/footer/footer.component';
import { FloatFooterComponent } from '../common/footer-floating/footer-floating.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./country.template.html');
let style = require('./country.css');

@Component({
  selector: 'country',
  template: tpl,
  styles: [style],
  directives: [
    HeaderWithoutSearchComponent,
    CountryInfoComponent,
    CountryPlacesComponent,
    FooterComponent,
    FloatFooterComponent,
    FooterSpaceDirective
  ]
})

export class CountryComponent implements OnInit, OnDestroy {
  protected title: string;
  protected math: any;
  protected countryId: string;
  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: any;

  public constructor(@Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
                     @Inject('Math') math: any) {
    this.activatedRoute = activatedRoute;
    this.math = math;
  }

  public ngOnInit(): void {
    this.queryParamsSubscribe = this.activatedRoute.params
      .subscribe((params: any) => {
        this.countryId = params.id;
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
  }
}
