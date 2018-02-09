import { Injectable } from '@angular/core';
import { UrlParameters } from "../../interfaces";
import { DefaultUrlParameters } from "../../defaultState";

@Injectable()
export class UrlParametersServiceMock {
  public parseString(urlString: string): UrlParameters {
    return DefaultUrlParameters;
  }

  public combineUrlPerPage(): void {}

  public getStringFromParams(param: string): string {
    return '';
  }

  getParamsStingForPage(page: string): string {
    return '';
  }

  dispatchToStore(params): void {}

  getAllParameters(): UrlParameters {
    return DefaultUrlParameters;
  }

  removeActiveHouse(): void {}
}
