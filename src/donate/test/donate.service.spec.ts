import { DonateService } from '../donate.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

describe('Donate Service', () => {
  const httpSpy = jasmine.createSpyObj('http', ['post']);
  let service: DonateService;

  beforeEach(() => {
    service = new DonateService(httpSpy);
    httpSpy.post.and.returnValue(Observable.of({ _body: `{"success":true,"error":null}` }));
  });

  it('check url for donation', done => {
    service.makeDonate('query');
    expect(httpSpy.post).toHaveBeenCalledWith(`${environment.consumerApi}/v1/donate`, 'query');
    done();
  });

  it('makeDonate should return body', done => {
    service.makeDonate('query').subscribe(value => {
      expect(value).toEqual({ error: null, success: true });
      done();
    });
  });
});