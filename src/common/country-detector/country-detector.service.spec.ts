import { Observable } from 'rxjs/Observable';
import { CountryDetectorService } from './country-detector.service';

describe('CountryDetector Service Test', () => {
  let service: CountryDetectorService;
  const httpSpy = jasmine.createSpyObj('http', ['get']);
  const mockResponse = {
    country: 'Ukraine',
    city: 'Kiev',
    countryCode: 'UA',
    region: '63'
  };

  beforeEach(() => {
    service = new CountryDetectorService(httpSpy);
    httpSpy.get.and.returnValue(Observable.of({ _body: JSON.stringify(mockResponse) }));
  });

  it('call ip-api', () => {
    service.getCountry();

    expect(httpSpy.get).toHaveBeenCalledWith('http://ip-api.com/json');
  });

  it('return country info', () => {
    service.getCountry().subscribe(value => {
      expect(value).toEqual({err: undefined, data: mockResponse});
    });
  });
});