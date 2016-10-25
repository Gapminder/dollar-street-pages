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
