import { LoaderService } from './loader.service';

describe('LoaderService Test', () => {
  let service: LoaderService;

  beforeEach(() => {
    service = new LoaderService();
  });

  it('set loader', () => {
    let result;
    service.getLoaderEvent().subscribe(value => {
      result = value;
    });

    service.setLoader(true);

    expect(result).toEqual({isLoaded: true});
  });
});