import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  public top: number = 0;

  public ngOnInit(): void {
    let header = document.querySelector('.main-header');
    let onboardingHeight = document.querySelector('.matrix-onboard');

    if (header) {
      this.top = header.clientHeight;

      if (onboardingHeight) {
        this.top = this.top - onboardingHeight.clientHeight;
      }
    }
  }
}
