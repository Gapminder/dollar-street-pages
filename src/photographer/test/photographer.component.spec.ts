import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PhotographerComponent } from '../photographer.component';
import { TranslateModule } from 'ng2-translate';
import { Angulartics2Module, Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import {
  TitleHeaderService,
  MathService,
  LanguageService,
  LoaderService
} from '../../common';
import {
  TitleHeaderServiceMock,
  AngularticsMock,
  Angulartics2GoogleAnalyticsMock,
  LanguageServiceMock,
  LoaderServiceMock
} from '../../test/';
import { PhotographerProfileComponent } from '../photographer-profile/photographer-profile.component';
import { PhotographerProfileService } from '../photographer-profile/photographer-profile.service';
import { PhotographerPlacesComponent } from '../photographer-places/photographer-places.component';
import { PhotographerPlacesService } from '../photographer-places/photographer-places.service';

describe('PhotographerComponent', () => {
  let fixture: ComponentFixture<PhotographerComponent>;
  let component: PhotographerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule,
        Angulartics2Module
      ],
      declarations: [
        PhotographerComponent,
        PhotographerProfileComponent,
        PhotographerPlacesComponent
      ],
      providers: [
        MathService,
        PhotographerProfileService,
        PhotographerPlacesService,
        { provide: TitleHeaderService, useValue: TitleHeaderServiceMock },
        { provide: Angulartics2, useClass: AngularticsMock },
        { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
        { provide: LanguageService, useClass: LanguageServiceMock },
        { provide: LoaderService, useClass: LoaderServiceMock }
      ]
    });

    fixture = TestBed.createComponent(PhotographerComponent);
    component = fixture.componentInstance;
  }));

  it('ngOnCreate() ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.titleHeaderService).toBeDefined();

    spyOn(component.queryParamsSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
