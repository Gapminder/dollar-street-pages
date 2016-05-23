import {Component} from '@angular/core';
import {HeaderMainComponent} from './header/header.main.component';
import {ConceptMainComponent} from './concept/concept.main.component';
import {ComparisonMainComponent} from './comparison/comparison.main.component';
import {ThingsMainComponent} from './things/things.main.component';
import {AboutMainComponent} from './about/about.main.component';
import {FooterComponent} from '../common/footer/footer.component';
import {PlacesMainComponent} from './places/places.main.component';
import {LoaderComponent} from '../common/loader/loader.component';

let tpl = require('./main.template.html');
let style = require('./main.css');

@Component({
  selector: 'main',
  template: tpl,
  styles: [style],
  directives: [HeaderMainComponent, FooterComponent, AboutMainComponent,
    ComparisonMainComponent, PlacesMainComponent, ThingsMainComponent, ConceptMainComponent, LoaderComponent]
})

export class MainComponent {
}

