import { Component, OnInit, Inject } from 'angular2/core';
import {
  RouterLink,
} from 'angular2/router';
import {ConceptMainService} from './concept.main.service';

let tpl = require('./concept.main.component.html');
let style = require('./concept.main.component.css');

@Component({
  selector: 'concept-main',
  template: tpl,
  styles: [style],
  providers: [ConceptMainService],
  directives:[RouterLink]
})

export class ConceptMainComponent {
  public conceptMainService:ConceptMainService;
  public activeThing:any = {};
  public amazonS3Url:any = 'http://static.dollarstreet.org.s3.amazonaws.com/';
  public images:any[] = [];
  public things:any[] = [];
  public houseClassForRegion:any = {
    Asia: 'asia-house',
    Africa: 'africa-house',
    Europe: 'europe-house',
    America: 'america-house'
  };

  constructor(@Inject(ConceptMainService) conceptMainService:any) {
    this.conceptMainService = conceptMainService;
  }

  ngOnInit() {
    this.conceptMainService.getMainConceptThings({})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.things = res.things;

        let lastThing = this.things[this.things.length - 1];

        this.activeThing = {_id: lastThing._id, plural: lastThing.plural, icon: lastThing.thingUrl};
        this.renderIncomePlot(this.activeThing);
      });
  }

  selectThing(thing:any) {
    this.activeThing = {_id: thing._id, plural: thing.plural, icon: thing.thingUrl};
    this.renderIncomePlot(thing);
  };

  renderIncomePlot(thing:any) {
    this.conceptMainService.getMainConceptImages({thingId: thing._id})
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }

        this.images = res.images;
      });
  }
}
