import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Angulartics2GoogleTagManager, Angulartics2Module } from 'angulartics2';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MathService } from '../../common';
import { PhotographersComponent } from '../photographers.component';
import { PhotographersService } from '../photographers.service';
import { PhotographersFilterPipe } from '../photographers-filter.pipe';

import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TranslateTestingModule } from '../../test/translateTesting.module';

describe('Integration: Component: PhotographersComponent', () => {
  let component: PhotographersComponent;
  let fixture: ComponentFixture<PhotographersComponent>;
  let photographersService: PhotographersServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonServicesTestingModule,
        Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
        TranslateTestingModule
      ],
      declarations: [
        PhotographersComponent,
        PhotographersFilterPipe
      ],
      providers: [
        MathService,
        {provide: PhotographersService, useClass: PhotographersServiceMock}
      ]
    });

    fixture = TestBed.createComponent(PhotographersComponent);
    component = fixture.componentInstance;
    photographersService = TestBed.get(PhotographersService);
  });

  it('toggleLeftSide should toggle sidebar', () => {
    spyOn(component, 'toggleLeftSide');
    component.ngAfterViewInit();

    component.isDesktop = false;
    const toggleBtn = fixture.debugElement.query(By.css('.sort-country'))
      .nativeElement
      .click();

    expect(component.toggleLeftSide).toHaveBeenCalled();
  });

  describe('Photographer card created on init', () => {
    beforeEach(() => {
      spyOn(photographersService, 'getPhotographers').and.returnValue(Observable.of({
        data: {
          countryList: countryListData,
          photographersList: photographerListData
        }
      }));

      component.ngAfterViewInit();
      fixture.detectChanges();
    });

    it('Cards created', () => {
      const cards = fixture.debugElement.queryAll(By.css('.photographer-card'));

      expect(cards.length).toEqual(photographerListData.length);
    });

    it('Avatar created', () => {
      const cardAvatar = fixture.debugElement.query(By.css('.photographer-portrait'));

      expect(cardAvatar.styles['background-image']).toEqual(photographerListData[0].avatar);
    });

    it('Card name set', () => {
      const cardName = fixture.debugElement.query(By.css('h3')).nativeElement;

      expect(cardName.textContent).toEqual(photographerListData[0].name);
    });

    it('show number of photographer images', () => {
      const imagesCounter = fixture.debugElement.query(By.css('.photographer-material span')).nativeElement;

      expect(Number(imagesCounter.textContent)).toEqual(photographerListData[0].images);
    });

    it('show number of photographer videos', () => {
      const videosCounter = fixture.debugElement.queryAll(By.css('.photographer-material span'))[1].nativeElement;

      expect(Number(videosCounter.textContent)).toEqual(photographerListData[0].video);
    });

    it('show number of photographer places', () => {
      const placesCounter = fixture.debugElement.queryAll(By.css('.photographer-material span'))[2].nativeElement;

      expect(Number(placesCounter.textContent)).toEqual(photographerListData[0].places);
    });
  });

  describe('Country list created on init', () => {
    beforeEach(() => {
      spyOn(photographersService, 'getPhotographers').and.returnValue(Observable.of({
        data: {
          countryList: countryListData,
          photographersList: photographerListData
        }
      }));

      component.ngAfterViewInit();
      fixture.detectChanges();
    });

    it('Country list created', () => {
      const countries = fixture.debugElement.queryAll(By.css('.country-card'));

      expect(countries.length).toEqual(countryListData.length);
    });

    it('Photographer country created', () => {
      const country = fixture.debugElement.query(By.css('.photographer-country')).nativeElement;

      expect(country.textContent).toEqual(countryListData[0].name);
    });

    it('Photographers_names_by_countries created', () => {
      const photographerName = fixture.debugElement.query(By.css('.photographers-list li')).nativeElement;

      expect(photographerName.textContent.trim()).toEqual(countryListData[0].photographers[0].name);
    });
  });
});

class PhotographersServiceMock {
  getPhotographers() {
    return Observable.of({
      data: {
        countryList: [],
        photographersList: []
      }
    });
  }
}

const countryListData = [
  {
    name: 'CountryName',
    photographers: [{
      avatar: 'country1',
      images: 1,
      name: 'country1',
      places: 1,
      userId: 'country1'
    }, {
      avatar: 'country2',
      images: 2,
      name: 'country2',
      places: 2,
      userId: 'country2'
    }]
  }];

const photographerListData = [
  {
    avatar: 'photographer1',
    images: 10,
    name: 'photographer1',
    places: 2,
    userId: 'photographer1',
    video: 1
  },
  {
    avatar: 'photographer1',
    images: 22,
    name: 'photographer1',
    places: 3,
    userId: 'photographer1',
    video: 2
  }];
