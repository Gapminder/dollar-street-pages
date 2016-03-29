import {provide} from 'angular2/core';
export class MockPhotographersService {

  subscribe(callback):void {
    callback(this.fakeResponse());
  }

  getProviders():Array<any> {
    return [provide('PhotographersService', {useValue: this})];
  }
  getPhotographers():this{
    return this
  }
  fakeResponse() {
    return {
      err: null,
      data: {
        "countryList": [{
          "name": "Bangladesh", "photographers": [{
            "name": "AJ Sharma", "userId": "56e946c4d360263447ff6fad",
            "avatar": null, "images": 289, "places": 4
          }]
        }],
        "photographersList": [{
          "name": "AJ Sharma",
          "userId": "56e946c4d360263447ff6fad",
          "avatar": null,
          "images": 289,
          "places": 4
        }]
      }
    }
  }

}





