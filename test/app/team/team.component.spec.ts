import { it, describe, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { MockService } from '../../app/common-mocks/mock.service.template';
import { team } from './mocks/data.ts';
import { TeamComponent } from '../../../app/team/team.component';

describe('TeamComponent', () => {
  let mockTeamService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockTeamService.serviceName = 'TeamService';
  mockTeamService.getMethod = 'getTeam';
  mockTeamService.fakeResponse = team;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockTeamService.getProviders()
    ]);
  });

  let context;
  let fixture;
  let nativeElement;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(TeamComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));

  it('must init', ()=> {
    fixture.detectChanges();
    expect(context.teamList.length).toEqual(3);
    expect(context.isLoaded).toEqual(false);
  });
});
