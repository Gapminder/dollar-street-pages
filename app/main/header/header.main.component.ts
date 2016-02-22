import {Component, Inject} from 'angular2/core';
import {
  Location
} from 'angular2/router';
import {SocialShareButtons} from '../../common/social_share_buttons/social_share_buttons.component';

let tpl = require('./header.main.component.html');
let style = require('./header.main.component.css');

@Component({
  selector: 'header-main',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons]
})

export class HeaderMainComponent {
  private location:Location;
  constructor( @Inject(Location) location){
    this.location=location;
  }
  /** remove document and other things .This code is not pretty*/
  animateScroll(selector, inc, duration, cb) {
    var elem = document.getElementById(selector);
    var startScroll = document.body.scrollTop;
    var endScroll = elem.offsetTop;
    var step = (endScroll - startScroll) / duration * inc;

    requestAnimationFrame(this.goToScroll(step, duration, inc, cb));
  }

  goToScroll(step, duration, inc, cb) {
    return ()=> {
      let currentDuration = duration - inc;
      document.body.scrollTop += step;
      if (currentDuration < inc) {
        cb();
        return;
      }
      requestAnimationFrame(this.goToScroll(step, currentDuration, inc, cb));
    };
  }

  goToAbout() {
    this.animateScroll('about', 20, 1000,  ()=> {
      this.location.replaceState(`/main#about`);
    });
  };
  goToConcept() {
    this.animateScroll('concept', 20, 1000,  ()=> {
      this.location.replaceState(`/main`);
    });
  };
}
