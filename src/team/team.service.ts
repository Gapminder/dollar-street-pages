import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Config } from '../app.config';

import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {
  public http: Http;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public getTeam(query: any): Observable<any> {
    return this.http.get(`${Config.api}/v1/team?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: this.sortTeamSpecial(parseRes.data)};
    });
  }

  public sortTeamSpecial(team: any[]): any[] {
    const coreTeam = ['Anna Rosling Rönnlund', 'Ola Rosling', 'Fernanda Drumond'];
    const contributors = ['Valor Software', 'Global Data Lab', 'Mattias Lindgren', 'Martha Nicholson', 'Olof Granström', 'Mikael Arevius'];

    let coreTeamObject: any = team.find((obj: any) => {return obj.originTypeName === 'Core team';});
    let contributorObject: any = team.find((obj: any) => {return obj.originTypeName === 'Contributor';});

    let changePos = (array: string[], old_index: number, new_index: number) => {
      if (new_index >= array.length) {
        let k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
      }

      array.splice(new_index, 0, array.splice(old_index, 1)[0]);

      return array;
    };

    coreTeam.forEach((name: string, new_index: number) => {
      let ambass: any = coreTeamObject.ambassadors.find((member: any) => {return member.originName === name;});
      changePos(coreTeamObject.ambassadors, coreTeamObject.ambassadors.indexOf(ambass), new_index);
    });

    contributors.forEach((name: string, new_index: number) => {
      let ambass: any = contributorObject.ambassadors.find((member: any) => {return member.originName === name;});
      changePos(contributorObject.ambassadors, contributorObject.ambassadors.indexOf(ambass), new_index);
    });

    return [coreTeamObject, contributorObject];
  }
}
