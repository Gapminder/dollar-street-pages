import { PagePositionService } from '../page-position.service';
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { UrlParametersServiceMock } from '../../../test/mocks/url-parameters.service.mock';
import { UrlParametersService } from '../../../url-parameters/url-parameters.service';

describe('PagePositionService', () => {
  let pagePositionService: PagePositionService;
  let urlParametersService: UrlParametersService;
  const RECT = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: -500,
    width: 1,
    x: 0,
    y: 0
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        { provide: UrlParametersService, useClass: UrlParametersServiceMock },
        PagePositionService
      ]
    });

    pagePositionService = TestBed.get(PagePositionService);
    urlParametersService = TestBed.get(UrlParametersService)
  }));

  it('getCurrentRow', () => {

    pagePositionService.itemSize = 100;

    const withoutRect = pagePositionService.getCurrentRow({} as ClientRect);

    expect(withoutRect).toBe(1);

    const resultWithRect = pagePositionService.getCurrentRow(RECT);

    expect(resultWithRect).toBe(6)

  })

  it('setCurrentRow', () => {
    spyOn(pagePositionService, 'getGridContainerRect').and.returnValue(RECT);
    spyOn(window, 'scrollTo');
    const ITEM_SIZE = 100;
    const NEED_POSITION = 3;

    pagePositionService.itemSize = ITEM_SIZE;

    pagePositionService.setCurrentRow();

    expect(pagePositionService.getGridContainerRect).not.toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();


    urlParametersService.needPositionByRoute = NEED_POSITION;

    const scrollTo = ITEM_SIZE * NEED_POSITION + Math.abs(RECT.top);

    pagePositionService.setCurrentRow();

    expect(pagePositionService.getGridContainerRect).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, scrollTo);
  });

  it ('findGridContainer', () => {
    spyOn(document, 'querySelector').and.returnValue({} as HTMLElement);

    const htmlElement = pagePositionService.findGridContainer();

    expect(document.querySelector).toHaveBeenCalled();

    expect(htmlElement).toEqual({} as HTMLElement);
  })
});
