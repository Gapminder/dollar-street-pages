import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TitleHeaderService } from '../common';
import { LanguageService } from '../shared/language-selector/language.service';

@Component({
  selector: 'photographer',
  templateUrl: './photographer.component.html',
  styleUrls: ['./photographer.component.css']
})

export class PhotographerComponent implements OnInit, OnDestroy {
  public photographerId: string;
  public activatedRoute: ActivatedRoute;
  public queryParamsSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public languageService: LanguageService;

  public constructor(activatedRoute: ActivatedRoute,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService) {
    this.activatedRoute = activatedRoute;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.languageService.updateLangUrl();

    this.queryParamsSubscribe = this.activatedRoute.params
      .subscribe((params: any) => {
        this.photographerId = params.id;
      });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscribe.unsubscribe();
  }

  public setTitle(title: string): void {
    this.titleHeaderService.setTitle(title);
  }
}
