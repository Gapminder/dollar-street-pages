import { TestBed } from '@angular/core/testing';
import { UtilsService } from '../utils.service';

describe('UtilsService', () => {
    let utilsService: UtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UtilsService]
        });

        utilsService = TestBed.get(UtilsService);
    });

    it('parseUrl()', () => {
        const urlParams: any = utilsService.parseUrl('http://dollar-street.org/matrix?thing=Homes&country=World&region=World');

        expect(urlParams.thing).toEqual('Homes');
        expect(urlParams.country).toEqual('World');
        expect(urlParams.region).toEqual('World');
    });

    it('objToQuery()', () => {
        const queryObject: any = {
            thing: 'Families',
            country: 'Cambodja',
            region: 'Africa'
        };

        let queryString: string = 'thing=Families&country=Cambodja&region=Africa';

        expect(utilsService.objToQuery(queryObject)).toEqual(queryString);
    });
});