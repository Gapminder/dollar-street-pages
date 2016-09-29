import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TitleHeaderService } from '../common/title-header/title-header.service';

let tpl = require('./photographer.template.html');
let style = require('./photographer.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style]
})

export class PhotographerComponent implements OnInit, OnDestroy {
  private photographerId: string;
  private activatedRoute: ActivatedRoute;
  private queryParamsSubscribe: Subscription;
  private titleHeaderService: TitleHeaderService;

  public constructor(activatedRoute: ActivatedRoute,
                     titleHeaderService: TitleHeaderService) {
    this.activatedRoute = activatedRoute;
    this.titleHeaderService = titleHeaderService;
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

  protected setTitle(title: string): void {
    this.titleHeaderService.setTitle(title);
  }
}
