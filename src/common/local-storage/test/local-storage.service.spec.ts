import { TestBed, async, getTestBed, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../local-storage.service';

describe('LocalStorageService', () => {
    let localStorageService: LocalStorageService;

    const key: string = 'storageKey';
    const value: string = 'storageValue';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [LocalStorageService]
        });

        const testBed = getTestBed();
        localStorageService = testBed.get(LocalStorageService);
    }));

    it('setItem(), getItem(), removeItem()', fakeAsync(() => {
        expect(localStorageService.localStorage).toBeDefined();

        localStorageService.setItem(key, value);

        expect(localStorageService.getItem(key)).toBe(value);

        localStorageService.removeItem(key);

        expect(localStorageService.getItem(key)).toBeFalsy();
    }));
});
