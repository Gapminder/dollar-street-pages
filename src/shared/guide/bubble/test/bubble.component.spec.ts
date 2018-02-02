import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { MockComponent } from 'ng2-mock-component';

import { BubbleComponent } from '../bubble.component';
import { CommonServicesTestingModule } from '../../../../test/commonServicesTesting.module';
import { UtilsServiceMock } from '../../../../test/mocks/utils.service.mock';
import { UtilsService } from '../../../../common/utils/utils.service';

describe('BubbleComponent Test', () => {
  let component: BubbleComponent;
  let fixture: ComponentFixture<BubbleComponent>;
  let utilsService: UtilsServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule
      ],
      declarations: [
        BubbleComponent,
        MockComponent({ selector: 'social-share-buttons' })
      ]
    })

    fixture = TestBed.createComponent(BubbleComponent);
    component = fixture.componentInstance;

    utilsService = TestBed.get(UtilsService);

    component.bubbles = defaultBubbles;
    fixture.detectChanges();
  }));

  it('subscribe on init', () => {
    expect(component.resizeSubscribe).toBeDefined();
    expect(component.keyUpSubscribe).toBeDefined();
  });

  it('unsubscribe on destroy', () => {
    spyOn(component.keyUpSubscribe, 'unsubscribe');
    spyOn(component.resizeSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.keyUpSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('back - decreases step property and calls step bubble', () => {
    const step = 2;
    component.step = step;
    spyOn(component, 'getBubble');

    component.back();

    expect(component.step).toEqual(step - 1);
    expect(component.getBubble).toHaveBeenCalledWith(step - 1);
  });

  it('back - on first step - do nothing', () => {
    const step = 1;
    component.step = step;
    spyOn(component, 'getBubble');

    component.back();

    expect(component.step).toEqual(step);
    expect(component.getBubble).not.toHaveBeenCalled();
  });

  it('next - increases step property and calls step bubble', () => {
    const step = 2;
    component.step = step;
    spyOn(component, 'getBubble');

    component.next();

    expect(component.step).toEqual(step + 1);
    expect(component.getBubble).toHaveBeenCalledWith(step + 1);
  });

  it('next - on last step - do nothing', () => {
    const step = defaultBubbles.length;
    component.step = step;
    spyOn(component, 'getBubble');

    component.next();

    expect(component.step).toEqual(step);
    expect(component.getBubble).not.toHaveBeenCalled();
  });
  
  const defaultBubbles = [
    {
      _id: "57835fbd4f8d95cb1f62c71e",
      name: "image",
      header: "Money is not everything!",
      description: "Click the photos to learn more about the families and their dreams.",
      link: { "text": "", "href": "" }
    },
    {
      _id: "57835fbd4f8d95cb1f62c71a",
      name: "thing",
      header: "The things we all have in common",
      description: "Everyone needs to eat, sleep and pee. We all have the same needs, but we can afford different solutions. Select from 100 topics. The everyday life looks surprisingly similar for people on the same income level across cultures and continents.",
      link: {}
    },
    {
      _id: "57835fbd4f8d95cb1f62c71c",
      name: "income",
      header: "To compare homes on similar incomes",
      description: "move these sliders to focus on a certain part of the street.",
      link: {}
    },
    {
      _id: "57835fbd4f8d95cb1f62c71f",
      name: "welcomeHeader",
      header: "",
      description: "<p>In the news people in other cultures seem stranger than they are.</p>\n<p>We visited 264 families in 50&nbsp;countries and collected 30,000 photos.</p>\n<p>We sorted the homes by income, from left to right.</p>",
      link: {}
    },
    {
      _id: "57835fbd4f8d95cb1f62c71d",
      name: "street",
      header: "Everyones lives on Dollar Street", "description": "Your house number shows your income per month. Most people live somewhere between the richest and the poorest.",
      link: {}
    },
    {
      _id: "57835fbd4f8d95cb1f62c71b",
      name: "geography",
      header: "In the same country, people can have very different incomes.",
      description: "Select countries and regions to compare homes from the same part of the world.",
      link: {}
    }];

  const stepsValues = [
    { number: 1, baloonDirector: '.street-box', bubble: defaultBubbles[4] },
    { number: 2, baloonDirector: 'things-filter', bubble: defaultBubbles[1] },
    { number: 3, baloonDirector: 'countries-filter', bubble: defaultBubbles[5] },
    { number: 4, baloonDirector: '.street-box', bubble: defaultBubbles[2] },
    { number: 5, baloonDirector: '.matrix-header', bubble: defaultBubbles[0] },
    { number: 6, baloonDirector: 'main-menu', bubble: defaultBubbles[4] }
  ];
  stepsValues.forEach(step => {
    it(`getBubble for ${step.number} step`, fakeAsync(() => {
      const utilsServiceCalls = spyOn(utilsService, 'getCoordinates').calls.all();

      component.getBubble(step.number);

      tick(100);

      expect(component.bubble).toEqual(step.bubble);
      expect(utilsService.getCoordinates).toHaveBeenCalled();
      expect(utilsServiceCalls[0].args).toContain(step.baloonDirector);
      expect(utilsServiceCalls[0].args.length).toEqual(2);
    }));
  });

  it('last step should close the bubble on desktop', () => {
    let data = { top: 1, left: 1 };
    component.setBubblePositionDesktop(6, data, 2, 3);

    expect(component.isCloseBubble).toBe(true);
  });

  it('last step should close the bubble on desktop', fakeAsync(() => {
    let data = { top: 1, left: 1 };
    component.setBubblePositionMobile(6, data, 2, 3);

    tick(100);

    expect(component.isCloseBubble).toBe(true);
  }));
});