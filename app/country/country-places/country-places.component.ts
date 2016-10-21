import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { MathService } from '../../common/math-service/math-service';
import { LoaderService } from '../../common/loader/loader.service';
import { CountryPlacesService } from './country-places.service';

@Component({
  selector: 'country-places',
  templateUrl: './country-places.template.html',
  styleUrls: ['./country-places.css']
})

export class CountryPlacesComponent implements OnInit, OnDestroy {
  @Input()
  private countryId: string;
  private places: any = [];
  private country: any;
  private math: MathService;
  private loaderService: LoaderService;
  private countryPlacesService: CountryPlacesService;
  private countryPlacesServiceSubscribe: Subscription;

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
