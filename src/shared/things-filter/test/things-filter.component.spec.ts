import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { TranslateModule } from 'ng2-translate';
import { StoreModule, Store } from '@ngrx/store';
import { AppStates } from '../../../interfaces';
import * as ThingsFilterActions from '../ngrx/things-filter.actions';
import { thingsFilterReducer } from '../ngrx/things-filter.reducers';
import {
    BrowserDetectionService,
    ActiveThingService,
    UtilsService
} from '../../../common';
import {
    BrowserDetectionServiceMock,
    Angulartics2GoogleAnalyticsMock,
    UtilsServiceMock
} from '../../../test/';
import { ThingsFilterPipe } from '../things-filter.pipe';
import { ThingsFilterComponent } from '../things-filter.component';

describe('ThingsFilterComponent', () => {
    let fixture: ComponentFixture<ThingsFilterComponent>;
    let component: ThingsFilterComponent;
    let store: Store<AppStates>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                Angulartics2Module,
                TranslateModule,
                StoreModule.forRoot({'feature': thingsFilterReducer})
            ],
            declarations: [
                ThingsFilterComponent,
                ThingsFilterPipe
            ],
            providers: [
                ActiveThingService,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        fixture = TestBed.createComponent(ThingsFilterComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();
    }));

    it('ngOnInit()', () => {
        component.ngOnInit();

        expect(component.thingsFilterStateSubscribtion).toBeDefined();
        expect(component.resizeSubscribe).toBeDefined();
    });

    it('goToThing() -> NGRX', () => {
        component.ngOnInit();

        component.goToThing({empty: false});

        const action = new ThingsFilterActions.GetThingsFilter('thing=undefined&countries=World&region=World');

        expect(store.dispatch).toHaveBeenCalledWith(action);
    });
});
