import { Component, OnInit } from 'angular2/core';


let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  inputs:['places'],
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
})

export class MatrixImagesComponent {

}
