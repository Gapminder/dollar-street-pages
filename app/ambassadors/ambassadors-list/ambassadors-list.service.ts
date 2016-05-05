import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

export class AmbassadorsListService {
  public getAmbassadors(query:any):Observable<any> {
    return of(this.getMockData());
  }

  getMockData() {
    return {
      err: null, data: [{
        position: 'Teachers',
        ambassadors: [{
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: ``,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }]
      }, {
        position: 'Writers',
        ambassadors: [{
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: ``,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `.`,
          img: '/assets/img/ambassador.svg',
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg',
        }]
      }, {
        position: 'Organisations',
        ambassadors: [{
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: ``,
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }, {
          name: 'Jonathan James',
          country: 'England',
          img: '/assets/img/university.png'
        }]
      }]
    };
  }
}
