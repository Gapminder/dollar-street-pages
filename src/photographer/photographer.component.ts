import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TitleHeaderService } from '../common';

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

  public setTitle(title: string): void {
    this.titleHeaderService.setTitle(title);
  }
}
