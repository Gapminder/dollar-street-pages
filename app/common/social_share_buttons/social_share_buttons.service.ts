import {Injectable} from 'angular2/core';
import {Location} from 'angular2/router';

@Injectable()
export class SocialShareButtonsService {

  constructor(location: Location) {}

  getUrl() {

    /**
     * todo: complete shorten url
     */
    console.log(location.href);

    return 'hello world'
  }
}
