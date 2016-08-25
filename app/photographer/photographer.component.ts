import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PhotographerProfileComponent } from './photographer-profile/photographer-profile.component';
import { PhotographerPlacesComponent } from './photographer-places/photographer-places.component';

let tpl = require('./photographer.template.html');
let style = require('./photographer.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives: [
    PhotographerProfileComponent,
    PhotographerPlacesComponent
  ]
})

export class PhotographerComponent implements OnInit, OnDestroy {
  protected photographerId: string;

  private activatedRoute: ActivatedRoute;
  private titleHeaderService: any;
  private queryParamsSubscribe: Subscription;

  public constructor(activatedRoute: ActivatedRoute,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
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
