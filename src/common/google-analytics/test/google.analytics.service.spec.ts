import { TestBed, async, getTestBed, fakeAsync } from '@angular/core/testing';

import { GoogleAnalyticsService } from '../google-analytics.service';

describe('GoogleAnalyticsService', () => {
    let analyticsService: GoogleAnalyticsService;

    let mockedWindowObject: any;

    let mockWindow = {
        ga: undefined
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                GoogleAnalyticsService,
                { provide: Window, useValue: mockWindow }
            ]
        });

        TestBed.compileComponents();

        const testBed = getTestBed();
        analyticsService = testBed.get(GoogleAnalyticsService);
        mockedWindowObject = testBed.get(Window);
    }));

    xit('googleAnalyticsContent()', fakeAsync(() => {
        expect(analyticsService).toBeDefined();

        analyticsService.window = mockedWindowObject;

        analyticsService.googleAnalyticsContent();

        expect((analyticsService.window as any).ga).toBeDefined();
    }));
});
