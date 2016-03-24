import {Component, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {SocialShareButtons} from '../../common/social_share_buttons/social-share-buttons.component.ts';
import {UrlChangeService} from '../../common/url-change/url-change.service';

let tpl = require('./header.main.template.html');
let style = require('./header.main.css');

@Component({
  selector: 'header-main',
  template: tpl,
  styles: [style],
  directives: [RouterLink, SocialShareButtons]
})

export class HeaderMainComponent {
  private urlChangeService:UrlChangeService;

  constructor(@Inject(UrlChangeService) urlChangeService) {
    this.urlChangeService = urlChangeService;
  }

  /** remove document and other things .This code is not pretty*/
  animateScroll(selector, inc, duration, cb) {
    let elem = document.getElementById(selector);
    let startScroll = document.body.scrollTop;
    let endScroll = elem.offsetTop;
    let step = (endScroll - startScroll) / duration * inc;

    requestAnimationFrame(this.goToScroll(step, duration, inc, cb));
  }

  goToScroll(step, duration, inc, cb) {
    return ()=> {
      let currentDuration = duration - inc;

      document.body.scrollTop += step;

      if (currentDuration < inc) {
        return cb();
      }

      requestAnimationFrame(this.goToScroll(step, currentDuration, inc, cb));
    };
  }

  goToAbout(e) {
    e.preventDefault();

    this.animateScroll('about', 20, 1000, () => {
      this.urlChangeService.replaceState('/main#about');
    });
  };

  goToConcept(e) {
    e.preventDefault();

    this.animateScroll('concept', 20, 1000, () => {
      this.urlChangeService.replaceState('/main');
    });
  };
}
