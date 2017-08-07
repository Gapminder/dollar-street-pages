import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MathService, TitleHeaderService } from '../common';

@Component({
  selector: 'country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit, OnDestroy {
  public title: string;
  public countryId: string;
  public math: MathService;
  public activatedRoute: ActivatedRoute;
  public queryParamsSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;

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

  public setTitle(title: string): void {
    this.titleHeaderService.setTitle(title);
  }
}
