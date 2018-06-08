import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { TitleHeaderService } from '../title-header.service';

describe('TitleHeaderService', () => {
    let titleHeaderService: TitleHeaderService;

    const title: string = 'New Title';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                TitleHeaderService
            ]
        });

        titleHeaderService = TestBed.get(TitleHeaderService);
    }));

    it('constructor()', () => {
        expect(titleHeaderService.getTitleEvent()).toBeDefined();
    });

    it('setTitle()', fakeAsync(() => {
        titleHeaderService.setTitle(title);

        expect(titleHeaderService.title).toEqual(title);

        expect(titleHeaderService.getTitle()).toEqual(title);
    }));
});
