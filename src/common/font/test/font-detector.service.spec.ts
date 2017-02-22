import { TestBed, async, getTestBed, fakeAsync } from '@angular/core/testing';

import { FontDetectorService } from '../font-detector.service';

import { LanguageService } from '../../language/language.service';

describe('FontDetectorService', () => {
    let fontDetectorService: FontDetectorService;

    let mockedDocumentObject: Document;

    const mockLanguageService = {
        currentLanguage: 'en'
    };

    const expectedStyle: string = 'latin-script';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FontDetectorService,
                { provide: LanguageService, useValue: mockLanguageService },
                { provide: Document, useFactory: () => {
                    let newDocument: Document = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', undefined);
                    let body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
                    let head = document.createElementNS('http://www.w3.org/1999/xhtml', 'head');
                    body.appendChild(head);
                    newDocument.documentElement.appendChild(body);

                    return newDocument;
                }}
            ]
        });

        const testBed = getTestBed();
        mockedDocumentObject = testBed.get(Document);
        fontDetectorService = testBed.get(FontDetectorService);
    }));

    it('detectFont()', fakeAsync(() => {
        expect(mockedDocumentObject).toBeDefined();

        fontDetectorService.document = mockedDocumentObject;

        fontDetectorService.detectFont();

        let linkElement: HTMLLinkElement = mockedDocumentObject.getElementsByTagName('link')[0];
        let hrefAttribute: string = linkElement.getAttribute('href');

        expect(hrefAttribute.indexOf(expectedStyle)).toBeTruthy();
    }));
});
