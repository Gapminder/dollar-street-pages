import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

let tpl = require('./matrix.component.html');
let style = require('./matrix.component.css');

@Component({
  selector: 'matrix',
  templateUrl: tpl,
  styleUrls: [style]
})
export class MatrixComponent {

}
