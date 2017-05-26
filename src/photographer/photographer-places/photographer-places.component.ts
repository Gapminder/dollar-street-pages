import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LoaderService, LanguageService } from '../../common';
import { PhotographerPlacesService } from './photographer-places.service';

@Component({
  selector: 'photographer-places',
  templateUrl: './photographer-places.component.html',
  styleUrls: ['./photographer-places.component.css']
})

export class PhotographerPlacesComponent implements OnInit, OnDestroy {
  @Input() public photographerId: string;
  public places: any = [];
  public math: MathService;
  public loaderService: LoaderService;
  public photographerPlacesServiceSubscribe: Subscription;
  public photographerPlacesService: PhotographerPlacesService;

  public languageService: LanguageService;

  public constructor(math: MathService,
                     loaderService: LoaderService,
                     photographerPlacesService: PhotographerPlacesService,
                     languageService: LanguageService) {
    this.math = math;
    this.loaderService = loaderService;
    this.photographerPlacesService = photographerPlacesService;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.photographerPlacesServiceSubscribe = this.photographerPlacesService
      .getPhotographerPlaces(`id=${this.photographerId}${this.languageService.getLanguageParam()}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.places = res.data.places;
        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.photographerPlacesServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }
}
