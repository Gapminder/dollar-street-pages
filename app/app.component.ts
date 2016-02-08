import {Component} from 'angular2/core';

@Component({
  selector: 'gapminder-app',
  template: `
    <alert type="info">Here will be new and shiny gapminder.org</alert>
  `
})
export class AppComponent {
  type:string = 'app component';

  constructor() {
  }
}
