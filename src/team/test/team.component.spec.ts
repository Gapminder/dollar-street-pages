import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Angulartics2, Angulartics2Module } from 'angulartics2';
import { Observable } from 'rxjs/Observable';
import {
  LoaderService,
  TitleHeaderService,
  LanguageService, Angulartics2GoogleTagManager
} from '../../common';
import {
    Angulartics2GoogleAnalyticsMock,
    AngularticsMock,
    LoaderServiceMock,
    TitleHeaderServiceMock,
    LanguageServiceMock
} from '../../test/';
import { TeamComponent } from '../team.component';
import { TeamService } from '../team.service';

describe('TeamComponent', () => {
    let fixture: ComponentFixture<TeamComponent>;
    let component: TeamComponent;

    class TeamServiceMock {
        public getTeam(): Observable<any> {
            return Observable.of([]);
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                Angulartics2Module
            ],
            declarations: [TeamComponent],
            providers: [
                { provide: TeamService, useClass: TeamServiceMock },
                { provide: Angulartics2GoogleTagManager, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: Angulartics2, useClass: AngularticsMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(TeamComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.teamSubscribe).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.teamSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.teamSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
