import {Component, OnInit, Input, ElementRef, Inject} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {StreetDrawService} from "./street.service";


let tpl = require('./street.component.html');
let style = require('./street.component.css');

@Component({
  selector: 'street',
  template: tpl,
  styles: [style],
})

export class StreetComponent implements OnInit {

  @Input('places')
  private places:Observable<any>;
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;
  @Input('hoverPlace')
  private hoverPlace:Observable<any>;

  private street:any;

  private element:HTMLElement;

  constructor(@Inject(ElementRef) element) {
    this.element = element.nativeElement;
  }

  ngOnInit():any {
    let svg = this.element.querySelector('.street-box svg') as HTMLElement;
    this.street = new StreetDrawService(svg);
    this.street.init();
    this.places.subscribe((places)=> {
      this.street
        .drawScale(places)
    });

    this.chosenPlaces.subscribe((chosenPlaces)=> {
      this.street.set('chosenPlaces', chosenPlaces).clearAndRedraw(chosenPlaces);
    });

    this.hoverPlace.subscribe((hoverPlace)=> {
      this.street.set('hoverPlace', hoverPlace);
      this.street.clearAndRedraw(this.street.chosenPlaces);
      if (!hoverPlace) {
        return;
      }
      this.street.drawHoverCircle(hoverPlace).drawHoverHouse(hoverPlace);

    })

  }

}
