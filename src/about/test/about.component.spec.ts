import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { HttpModule } from '@angular/http';

import { LoaderService, TitleHeaderService, LanguageService } from '../../common';

import { AboutComponent } from '../about.component';
import { AboutService } from '../about.service';

describe('AboutComponent', () => {
  let componentInstance: AboutComponent;
  let componentFixture: ComponentFixture<AboutComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  const userAboutService = {

  };

  const userLoaderService = {
    setLoader: (b: boolean) => {
      return b;
    }
  };

  const userTitleHeaderService = {

  };

  const userLanguageService = {
    getTranslation: () => {
      return;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ AboutComponent ],
      providers: [{ provide: AboutService, useValue: userAboutService },
                  { provide: LoaderService, useValue: userLoaderService },
                  { provide: TitleHeaderService, useValue: userTitleHeaderService },
                  { provide: LanguageService, useValue: userLanguageService }]
    });

    componentFixture = TestBed.createComponent(AboutComponent);

    componentInstance = componentFixture.componentInstance;
    debugElement = componentFixture.debugElement.query(By.css('div'));
    nativeElement = debugElement.nativeElement;
  }));

  it('Div with ID', () => {
    expect(nativeElement.getAttribute('id')).toEqual('info-context');
  });
});
