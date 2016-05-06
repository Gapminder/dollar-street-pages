import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

export class AmbassadorsListService {
  public getAmbassadors():Observable<any> {
    return of(this.getMockData());
  }

  public getMockData():any {
    return {
      err: void 0, data: [{
        position: 'Teachers',
        ambassadors: [{
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: ``,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }]
      }, {
        position: 'Writers',
        ambassadors: [{
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: ``,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `.`,
          img: '/assets/img/ambassador.svg'
        }, {
          name: 'Jonathan James',
          country: 'England',
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. void 0a in placerat massa. Donec sodales risus quis augue tincidunt iaculis.`,
          img: '/assets/img/ambassador.svg'
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
