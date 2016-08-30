import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CountryInfoComponent } from './country-info/country-info.component';
import { CountryPlacesComponent } from './country-places/country-places.component.ts';

let tpl = require('./country.template.html');
let style = require('./country.css');

@Component({
  selector: 'country',
  template: tpl,
  styles: [style],
  directives: [
    CountryInfoComponent,
    CountryPlacesComponent
  ]
})

export class CountryComponent implements OnInit, OnDestroy {
  protected title: string;
  protected math: any;
  protected countryId: string;
  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: Subscription;
  private titleHeaderService: any;

  public constructor(activatedRoute: ActivatedRoute,
                     @Inject('Math') math: any,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
    this.activatedRoute = activatedRoute;
    this.titleHeaderService = titleHeaderService;
    this.math = math;
  }

  public ngOnInit(): void {
    this.titleHeaderService.setTitle('');

    this.queryParamsSubscribe = this.activatedRoute
      .params
      .subscribe((params: any) => {
        this.countryId = params.id;
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
  }

  protected setTitle(title: string): void {
    this.titleHeaderService.setTitle(title);
  }
}
