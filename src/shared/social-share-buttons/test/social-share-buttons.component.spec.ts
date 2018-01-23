import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { LanguageService, SocialShareService } from '../../../common';
import { LanguageServiceMock } from '../../../test/';
import { SocialShareButtonsComponent } from '../social-share-buttons.component';
import { SocialShareButtonsService } from '../social-share-buttons.service';
import { Observable } from 'rxjs/Observable';

// TODO fix this
// mock window
xdescribe('SocialShareButtonsComponent', () => {
  let fixture: ComponentFixture<SocialShareButtonsComponent>;
  let component: SocialShareButtonsComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [SocialShareButtonsComponent],
      providers: [
        // SocialShareService,
        { provide: SocialShareService, useClass: SocialShareServiceMock },
        { provide: SocialShareButtonsService, useClass: SocialShareButtonsServiceMock },
        { provide: LanguageService, useClass: LanguageServiceMock }
      ]
    });

    fixture = TestBed.createComponent(SocialShareButtonsComponent);
    component = fixture.componentInstance;

    component.newWindow = null;
  }));

  it('ngOnInit(), ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.getTranslationSubscribe).toBeDefined();

    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('openPopUp()', () => {
    component.ngOnInit();

    spyOn(component.window, 'open').and.callFake(() => {
    });

    component.openPopUp('twitter');

    expect(component.socialShareButtonsServiceSubscribe).toBeDefined();
  });
});

class SocialShareServiceMock {

}

class SocialShareButtonsServiceMock {
  getUrl(query: any): Observable<any> {
    return Observable.of({ err: null, url: null });
  }
}
