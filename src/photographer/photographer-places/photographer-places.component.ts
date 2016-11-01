import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MathService, LoaderService } from '../../common';
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

  public constructor(math: MathService,
                     loaderService: LoaderService,
                     photographerPlacesService: PhotographerPlacesService) {
    this.math = math;
    this.loaderService = loaderService;
    this.photographerPlacesService = photographerPlacesService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.photographerPlacesServiceSubscribe = this.photographerPlacesService
      .getPhotographerPlaces(`id=${this.photographerId}`)
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
