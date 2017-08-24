import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { RegionMapComponent } from '../region-map.component';

describe('RegionMapComponent', () => {
    let fixture: ComponentFixture<RegionMapComponent>;
    let component: RegionMapComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [RegionMapComponent],
            providers: []
        });

        fixture = TestBed.createComponent(RegionMapComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit()', () => {
        component.ngAfterViewInit();

        expect(component.resizeSubscriber).toBeDefined();

        spyOn(component.resizeSubscriber, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.resizeSubscriber.unsubscribe).toHaveBeenCalled();
    });

    it('getMapImage()', () => {
        component.ngAfterViewInit();

        let regionUrl: string = component.getMapImage('Africa');

        expect(regionUrl).toMatch(/\/assets\/img\/map-africa.png/g);
    });

    it('drawMarker()', () => {
        component.ngAfterViewInit();

        component.mapImage = document.createElement('img') as HTMLImageElement;

        component.drawMarker({lat: 12, lng: 12, region: 'Africa'}, {src: ''});

        expect(component.mapImage.getAttribute('src')).toMatch(/\/assets\/img\/map-africa.png/g);
    });
});