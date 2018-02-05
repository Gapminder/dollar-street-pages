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
  public photographerPlacesServiceSubscribe: Subscription;
  public currentLanguage: string;

  public constructor(private math: MathService,
                     private loaderService: LoaderService,
                     private photographerPlacesService: PhotographerPlacesService,
                     private languageService: LanguageService) {
    this.currentLanguage = this.languageService.currentLanguage;
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
