import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MainMenuComponent } from '../menu/menu.component';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header-without-filters',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent, ROUTER_DIRECTIVES]
})

export class HeaderWithoutFiltersComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('heading')
  private heading: ElementRef;

  private title: string;

  private defaultThing: any;
  private headerService: any;
  private titleHeaderService: any;
  private titleHeaderSubscribe: Subscription;
  private headerServiceSubscribe: Subscription;
  private renderer: Renderer;

  public constructor(renderer: Renderer,
                     @Inject('HeaderService') headerService: any,
                     @Inject('TitleHeaderService') titleHeaderService: any) {
    this.renderer = renderer;
    this.headerService = headerService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.headerServiceSubscribe = this.headerService
      .getDefaultThing()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.defaultThing = res.data;
      });

    this.title = this.titleHeaderService.getTitle();

    this.titleHeaderSubscribe = this.titleHeaderService
      .getTitleEvent()
      .subscribe((data: {title: string}) => {
        this.rendererTitle(data.title);
      });
  }

  public ngOnDestroy(): void {
    this.titleHeaderSubscribe.unsubscribe();
    this.headerServiceSubscribe.unsubscribe();
  }

  public ngAfterViewInit(): any {
    this.rendererTitle(this.title);
  }

  private rendererTitle(title: string): void {
    this.renderer.setElementProperty(this.heading.nativeElement, 'innerHTML', title);
  }
}
