import {provide} from 'angular2/core';
export class MockPhotographersService {
  public isDestoyed = false;

  subscribe(callback):this {
    callback(this.fakeResponse());
    return this;
  }

  unsubscribe():void {
    this.isDestoyed = !this.isDestoyed;
  }

  getProviders():Array<any> {
    return [provide('PhotographersService', {useValue: this})];
  }

  getPhotographers():this {
    return this
  }

  fakeResponse() {
    return {
      err: null,
      data: {
        "countryList": [   {
          "name": "Albania", "photographers": [{
            "name": "AJ Sharma",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          }]
        },
          {
            "name": "Bangladesh", "photographers": [{
            "name": "Igor Nepipenko",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          }]
          },
          {
            "name": "Russia", "photographers": [{
            "name": "Igor Markov",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          },{
            "name": "Igor Nepipenko",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          }]
          },
          {
            "name": "France", "photographers": [{
            "name": "Vladimir Loban",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          }]
          }],
        "photographersList": [{
          "name": "AJ Sharma",
          "userId": "56e946c4d360263447ff6fad",
          "avatar": null,
          "images": 289,
          "places": 4
        }
          ,
          {
            "name": "Igor Nepipenko",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          },
          {
            "name": "Igor Markov",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          },
          {
            "name": "Vladimir Loban",
            "userId": "56e946c4d360263447ff6fad",
            "avatar": null,
            "images": 289,
            "places": 4
          }]
      }
    }
  }

}





