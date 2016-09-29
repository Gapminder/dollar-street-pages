import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MathService } from '../common/math-service/math-service';
import { TitleHeaderService } from '../common/title-header/title-header.service';

let tpl = require('./country.template.html');
let style = require('./country.css');

@Component({
  selector: 'country',
  template: tpl,
  styles: [style]
})

export class CountryComponent implements OnInit, OnDestroy {
  protected title: string;
  private countryId: string;
  private math: MathService;
  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;

  public constructor(activatedRoute: ActivatedRoute,
                     math: MathService,
                     titleHeaderService: TitleHeaderService) {
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
