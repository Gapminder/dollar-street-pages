import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MathService, TitleHeaderService } from '../common';
import { LanguageService } from '../shared/language-selector/language.service';

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
  public languageService: LanguageService;

  public constructor(activatedRoute: ActivatedRoute,
                     math: MathService,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService) {
    this.activatedRoute = activatedRoute;
    this.titleHeaderService = titleHeaderService;
    this.math = math;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.languageService.updateLangUrl();

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
