import { TestBed, async, getTestBed, fakeAsync } from '@angular/core/testing';
import { BrowserDetectionService } from '../browser-detection.service';
import {
    BrowserDetectionServiceMock
} from '../../../test/';

describe('BrowserDetectionService', () => {
    let browserDetectionService: BrowserDetectionService;

    let mockedWindowObject: any;

    let mockWindow = {
        navigator: {
            userAgent: 'mozilla/5.0 (x11; linux x86_64) applewebkit/537.36 (khtml, like gecko) chrome/52.0.2743.116 safari/537.36'
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: Window, useValue: mockWindow }
            ]
        });

        const testBed = getTestBed();
        browserDetectionService = testBed.get(BrowserDetectionService);
        mockedWindowObject = testBed.get(Window);
    }));

    it('userAgent', fakeAsync(() => {
        expect(browserDetectionService).toBeDefined();

        browserDetectionService.window = mockedWindowObject;

        expect(browserDetectionService.userAgent).toBeDefined();
        expect(browserDetectionService.isDesktop).toBeTruthy();
    }));
});
