'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
const AbstractPage = require('../Pages/AbstractPage.ts');
let photographerName = element.all(by.css('.photographer-card>h3'));
let photographerPortrait = element.all(by.css('.photographer-portrait'));
let camerasIcon = element.all(by.css('.fa.fa-camera'));
let homesIcon = element.all(by.css('.photographer-material>span>img'));
let lastPhotographer = $('.photographer-card[href="/photographer?id=56ec0917af72e9437cbccf93"]');
let searchFieldElement = $('#search');
let foundPhotographer = $('.photographer-card>h3');
let familiesIcon = $('.place');

let PhotographersPage = function () {
  this.getSearchButton = () => {
    return searchFieldElement; };
  this.isDisplayedPhotographerName = () => {
    return photographerName.isDisplayed(); };
  this.isDisplayedPhotographerPortrait = () => {
    return photographerPortrait.isDisplayed(); };
  this.isDisplayedCamerasIcon = () => {
    return camerasIcon.isDisplayed(); };
  this.isDisplayedHomesIcon = () => {
    return homesIcon.isDisplayed(); };
  this.getLastPhotographer = () => {
    return lastPhotographer; };
  this.setErrorMessage = () => {
    return 'Last photographer on Photographers Page is not loaded'; };
  this.getFoundPhotographer = () => {
    return foundPhotographer; };
  this.getFamiliesIcon = () => {
    return familiesIcon; };
  this.setFamilyErrorMessage = (name) => { return name + 'Families on Photographer Page is not loaded'; };
};
PhotographersPage.prototype = Object.create(AbstractPage.prototype);
module.exports = PhotographersPage;
