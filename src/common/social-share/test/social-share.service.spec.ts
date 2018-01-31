import { fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import { SocialShareService } from '../social-share.service';
import { LanguageServiceMock } from '../../../test/';

describe('SocialShareService Test', () => {
  let service: SocialShareService;
  const httpSpy = jasmine.createSpyObj('http', ['post']);
  const defaultResponse = {
    error: null,
    data: '/fake/url'
  };

  beforeEach(() => {
    service = new SocialShareService(new LanguageServiceMock() as any, httpSpy);
    httpSpy.post.and.returnValue(Observable.of({ _body: JSON.stringify(defaultResponse) }));
  });

  it('openPopup calls shorturl through http', () => {
    const pathname = service.window.location.pathname;
    const search = service.window.location.search;

    service.openPopUp('twitter');

    expect(httpSpy.post).toHaveBeenCalledWith(`${environment.consumerApi}/v1/shorturl`, { url: pathname + search });
  });

  it('openPopup(): check default url', fakeAsync(() => {
    spyOn(service, 'openWindow');
    service.openPopUp('');
    tick();

    expect(service.openWindow).toHaveBeenCalledWith('', '');
  }));

  it('openPopup(): check twitter url', fakeAsync(() => {
    spyOn(service, 'openWindow');
    service.openPopUp('twitter');
    tick();

    expect(service.openWindow).toHaveBeenCalledWith('https://twitter.com/intent/tweet', 'url=%2Ffake%2Furl&text=see_how_people+really+live+-+Dollar+Street');
  }));

  it('openPopup(): check facebook url', fakeAsync(() => {
    spyOn(service, 'openWindow');
    service.openPopUp('facebook');
    tick();

    expect(service.openWindow).toHaveBeenCalledWith('http://www.facebook.com/sharer.php', 'u=%2Ffake%2Furl&description=see_how_people+really+live+');
  }));

  it('openPopup(): check linkedIn url', fakeAsync(() => {
    spyOn(service, 'openWindow');
    service.openPopUp('linkedin');
    tick();

    expect(service.openWindow).toHaveBeenCalledWith('http://www.linkedin.com/shareArticle', 'mini=true&url=%2Ffake%2Furl&summary=see_how_people+really+live+');
  }));

  it('openPopup(): check googlePlus url', fakeAsync(() => {
    spyOn(service, 'openWindow');
    service.openPopUp('google');
    tick();

    expect(service.openWindow).toHaveBeenCalledWith('https://plus.google.com/share', 'url=%2Ffake%2Furl&text=see_how_people+really+live+');
  }));

  it('call openPopup() with url as parameter', fakeAsync(() => {
    spyOn(service, 'openWindow');
    service.openPopUp('google', '/test');
    tick();

    expect(service.openWindow).toHaveBeenCalledWith('https://plus.google.com/share', 'url=%2Ftest&text=see_how_people+really+live+');
  }));  
});
