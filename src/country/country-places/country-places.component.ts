import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LoaderService } from '../../common';
import { CountryPlacesService } from './country-places.service';

@Component({
  selector: 'country-places',
  templateUrl: './country-places.component.html',
  styleUrls: ['./country-places.component.css']
})

export class CountryPlacesComponent implements OnInit, OnDestroy {
  @Input()
  public countryId: string;
  public places: any = [];
  public country: any;
  public math: MathService;
  public loaderService: LoaderService;
  public countryPlacesService: CountryPlacesService;
  public countryPlacesServiceSubscribe: Subscription;

  public constructor(countryPlacesService: CountryPlacesService,
                     loaderService: LoaderService,
                     math: MathService) {
    this.countryPlacesService = countryPlacesService;
    this.math = math;
    this.loaderService = loaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.countryPlacesServiceSubscribe = this.countryPlacesService.getCountryPlaces(`id=${this.countryId}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.places = res.data.places;

        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.loaderService.setLoader(false);
    this.countryPlacesServiceSubscribe.unsubscribe();
  }
}
